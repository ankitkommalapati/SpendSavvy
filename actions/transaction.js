"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeAmount=(obj)=>({
    ...obj,
    amount:obj.amount.toNumber(),
});

export async function createTransaction(data){
    try {
        const {userId}=await auth();
        if(!userId) throw new Error("Unauthorized");

        //Rate limiting using Arcjet
        const req=await request();
        const decision=await aj.protect(req,{
            userId,
            requested:1, //No of tokens to consume
        });
        if (decision.isDenied()){
            if(decision.reason.isRateLimit()){
                const {remaining,reset}=decision.reason;
                console.error({
                    code:"RATE_LIMIT_EXCEEDED",
                    details:{
                        remaining,
                        resetInSeconds:reset,
                    },
                });
                throw new Error("Too many requests. Please try again later.");
            }
            throw new Error("Request Blocked");
        }

        const user=await db.user.findUnique({
            where:{clerkUserId:userId},
        });

        if(!user){
            throw new Error("User not found");
        }

        const account=await db.account.findUnique({
            where:{
                id:data.accountId,
                userId:user.id,
            },
        });
        if(!account){
            throw new Error("Account not found");
        }
        const balanceChange=data.type==="EXPENSE"?-data.amount:data.amount;
        const newBalance=account.balance.toNumber()+balanceChange;

        const transaction=await db.$transaction(async(tx)=>{
            const newTransaction=await tx.transaction.create({
                data:{
                    ...data,
                    userId:user.id,
                    nextRecurringDate:data.isRecurring && data.recurringInterval
                    ? calculateNextRecurringDate(data.date,data.recurringInterval)
                    : null,
                },
            })
            await tx.account.update({
                where:{id:data.accountId},
                data:{balance:newBalance},
            });
            return newTransaction;
        });

        revalidatePath('/dashboard');
        revalidatePath(`/account/${transaction.accountId}`);

        return {success:true,data:serializeAmount(transaction)};
    } catch (error) {
        throw new Error(error.message);
    }
}

function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);
  
    switch (interval) {
      case "DAILY":
        date.setDate(date.getDate() + 1);
        break;
      case "WEEKLY":
        date.setDate(date.getDate() + 7);
        break;
      case "MONTHLY":
        date.setMonth(date.getMonth() + 1);
        break;
      case "YEARLY":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  
    return date;
}