---
title: "A MIPS calculator"
date: "2010-03-23"
---

One of my other modules this year included a Computer Architecture course, which included some basic assembly programming in the first part and some hardware basics in the second part. The assembly language we learnt was MIPS, and used the SPIM simulator to test the programming. Our final project was a simple MIPS calculator which I have uploaded below. Got an A grade in this one tooo!

```mips
.data

str0: .asciiz "nWelcome to Interactive Calculator 1.0" str1: .asciiz "nn Enter first value: " str2: .asciiz " Enter (+, -, /, \*): " str3: .asciiz "n Enter second value: " str4: .asciiz "n Invalid Operator! Try again. " str5: .asciiz "n Answer is: " str6: .asciiz "nn Another Calculation? y, n: " str7: .asciiz "nn Invalid input! Please enter y or n." str8: .asciiz "nn Calculator Terminated."

.text .globl main

main: addi $v0, $0, 4

la $a0, str0 syscall #printing str0

calc: addi $v0, $0, 4

la $a0, str1 syscall #printing str1

addi $v0, $0, 6

syscall mov.s $f1, $f0 #reading and storing first value

addi $v0, $0, 4

la $a0, str2

syscall #printing st2

addi $v0, $0, 12

syscall #reading operator

add $a1, $v0, $0 #storing operator

addi $v0, $0, 4

la $a0, str3 syscall #printing str3

addi $v0, $0, 6

syscall mov.s $f2, $f0 #reading and storing second value

addi $9, $0, 0x2b beq $a1, $9, addIt #checking if + addi $9, $0, 0x2d beq $a1, $9, subIt #checking if -

addi $9, $0, 0x2a beq $a1, $9, mulIt #checking if \*

addi $9, $0, 0x2f beq $a1, $9, divIt #checking if addi $v0, $0, 4

la $a0, str4

syscall #printing str4 j calc

addIt: add.s $f12, $f1, $f2 #adding values j printAnswer

subIt: sub.s $f12, $f1, $f2 #subtracting values j printAnswer

mulIt: mul.s $f12, $f1, $f2 #multiplying values j printAnswer

divIt: div.s $f12, $f1, $f2 #dividing values j printAnswer

printAnswer: addi $v0, $0, 4

la $a0, str5

syscall #printing str5 li $v0, 2 syscall #printing answer j anotherCalc

anotherCalc: addi $v0, $0, 4

la $a0, str6

syscall #printing str6

addi $v0, $0, 12

syscall #reading command

add $a1, $v0, $0 #storing command

addi $9, $0, 0x79 beq $a1, $9, calc #checking if y

addi $9, $0, 0x6e beq $a1, $9, exitApp #checking if n

addi $v0, $0, 4

la $a0, str7

syscall #printing str7 j anotherCalc

exitApp: addi $v0, $0, 4

la $a0, str8

syscall #printing str8 jr $31 # Exit main subroutine.
```
