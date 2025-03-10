import { getUserAccounts } from '@/actions/dashboard';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import React from 'react'
import AccountCard from './_components/account-card';
import { getCurrentBudget } from '@/actions/budget';
import BudgetProgress from './_components/budget-progress';

async function DashboardPage(){
    const accounts=await getUserAccounts();
    const defaultAccount=accounts?.find((account)=>account.isDefault);
    let budgetData=null;
    if(defaultAccount){
        budgetData=await getCurrentBudget(defaultAccount.id);
    }
    return ( 
        <div className='space-y-8'>
            {/*Budget Progress*/}
            {defaultAccount && (
                <BudgetProgress
                    initialBudget={budgetData?.budget}
                    currentExpenses={budgetData?.currentExpenses||0}
                />
            )}

            {/*Accounts Grid*/}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <CreateAccountDrawer>
                    <Card className="hover:shadow-md transition-shadow cursoe-pointer border-dashed">
                        <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                            <Plus className='h-10 w-10 mb-2'/>
                            <p className='text-sm font-medium'>Add New Account</p>
                        </CardContent>
                    </Card>
                </CreateAccountDrawer>

                {accounts.length>0 && accounts?.map((account)=>{
                    return <AccountCard key={account.id} account={account}/>;
                })}
            </div>
        </div>
    );
}
export default DashboardPage