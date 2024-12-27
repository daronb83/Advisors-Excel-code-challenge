import { dbUpdateAccountAmount } from "../utils/db";
import { getAccount } from "./accountHandler";

export const withdrawal = async (accountID: string, withdrawalAmount: number) => {
  const account = await getAccount(accountID);
  validateWithdrawal(account.amount, account.type === 'credit', account.credit_limit, withdrawalAmount);
  account.amount -= withdrawalAmount;
  await dbUpdateAccountAmount(account.amount, accountID);

  return account;
}

export const deposit = async (accountID: string, depositAmount: number) => {
  const account = await getAccount(accountID);
  validateDeposit(account.amount, account.type === 'credit', depositAmount);
  account.amount += depositAmount;
  await dbUpdateAccountAmount(account.amount, accountID);

  return account;
}

const validateWithdrawal = (accountAmount: number, isCreditAccount: boolean, creditLimit: number, withdrawalAmount: number) => {
  if (withdrawalAmount > 200) {
    throw new Error("Withdrawals are limited to $200 per transaction.");
  }
  if (withdrawalAmount % 5 !== 0) {
    throw new Error("Withdrawals must be in increments of $5.");
  }
  if (accountAmount < withdrawalAmount) {
    if (!isCreditAccount) 
      throw new Error("Insufficient funds.")
    if (accountAmount - withdrawalAmount + creditLimit < 0)
      throw new Error(`Withdrawal exceeds credit limit of $${creditLimit}.`);
  }
}

const validateDeposit = (accountAmount: number, isCreditAccount: boolean, depositAmount: number) => {
  if (depositAmount > 1000) {
    throw new Error("Deposits are limited to $1000 per transaction.");
  }
  if (isCreditAccount && accountAmount + depositAmount > 0) {
    throw new Error("Deposit exceeds your balance due.");
  }
}