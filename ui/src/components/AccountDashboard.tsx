import React, { useState } from "react"
import {account} from "../Types/Account"
import Paper from "@mui/material/Paper/Paper";
import { Button, Card, CardContent, Grid, TextField } from "@mui/material";

type AccountDashboardProps = {
  account: account;
  signOut: () => Promise<void>;
}

export const AccountDashboard = (props: AccountDashboardProps) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [account, setAccount] = useState(props.account);
  const [dailyWithdrawRemaining, setDailyWithdrawRemaining] = useState(400);
  const [transactionType, setTransactionType] = useState('');
  const [error, setError] = useState('');

  const {signOut} = props;

  const updateAccount = (data: any) => {
    setError(data.error ? data.error || 'An error has occured.' : '');
    if (!data.error && !isNaN(data.amount)) {
      setAccount({
        ...account,
        amount: data.amount,
      });
    }
  }

  const getData = async (url: string, transactionAmount: number) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({amount: transactionAmount})
    }
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    return data;
  }

  const depositFunds = async () => {
    setTransactionType('deposit');
    const url = `http://localhost:3000/transactions/${account.accountNumber}/deposit`;
    if (validateDeposit()) {
      const data = await getData(url, depositAmount);
      updateAccount(data);
    }
  }

  const validateDeposit = () => {
    let e = '';
    e = depositAmount > 1000 ? "Withdrawals are limited to $1000 per transaction." : e;
    e = account.type === 'credit' && account.amount + depositAmount > 0 ? "Deposit exceeds your balance due." : e;
    setError(e);
    return e === '';
  }

  const withdrawFunds = async () => {
    setTransactionType('withdraw');
    const url = `http://localhost:3000/transactions/${account.accountNumber}/withdraw`;
    if (validateWithdraw()) {
      const data = await getData(url, withdrawAmount);
      updateAccount(data);
      setDailyWithdrawRemaining(dailyWithdrawRemaining - withdrawAmount);
    }
  }

  const validateWithdraw = () => {
    let e = '';
    e = withdrawAmount > 200 ? "Withdrawals are limited to $200 per transaction." : e;
    e = withdrawAmount % 5 !== 0 ? "Withdrawals must be in increments of $5." : e;
    e = dailyWithdrawRemaining - withdrawAmount < 0 ? 
      `Daily withdrawal limit exceeded. Remaining: $${dailyWithdrawRemaining}` : e;
    if (account.amount < withdrawAmount) {
      e = account.type !== 'credit' ? "Insufficient funds." : e;
      e = account.type === 'credit' && account.amount - withdrawAmount + account.creditLimit < 0 ? 
        `Withdrawal exceeds credit limit of $${account.creditLimit}.` : e;
    }
    setError(e);
    return e === '';
  }

  return (
    <Paper className="account-dashboard">
      <div className="dashboard-header">
        <h1>Hello, {account.name}!</h1>
        <Button variant="contained" onClick={signOut}>Sign Out</Button>
      </div>
      <h2>Balance: ${account.amount}</h2>
      <Grid container spacing={2} padding={2}>
        <Grid item xs={6}>
          <Card className="deposit-card">
            <CardContent>
              <h3>Deposit</h3>
              <TextField 
                label="Deposit Amount" 
                variant="outlined" 
                type="number"
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => setDepositAmount(+e.target.value)}
                error={error.length > 0 && transactionType === 'deposit'}
                helperText={transactionType === 'deposit' ? error : ''}
              />
              <Button 
                variant="contained" 
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2}}
                onClick={depositFunds}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className="withdraw-card">
            <CardContent>
              <h3>Withdraw</h3>
              <TextField 
                label="Withdraw Amount" 
                variant="outlined" 
                type="number" 
                sx={{
                  display: 'flex',
                  margin: 'auto',
                }}
                onChange={(e) => setWithdrawAmount(+e.target.value)}
                error={error.length > 0 && transactionType === 'withdraw'}
                helperText={transactionType === 'withdraw' ? error : ''}
              />
              <Button 
                variant="contained" 
                sx={{
                  display: 'flex', 
                  margin: 'auto', 
                  marginTop: 2
                }}
                onClick={withdrawFunds}
                >
                  Submit
                </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
    
  )
}