# Complex numbers

## Introduction

> section: introduction
> id: drawing

Remember how we learned in Foundations that, if we remain on the positive side
of the number line, multiplication is essentially stretching and squeezing and
to be able to have negative numbers, we had to add the idea of flipping to our
concept of multiplication?

If multiplication by a negative number is flipping, then it follows that a flip
followed by another flip, brings you back to the original side. In other words,
multiplying a negative number with another negative gives a positive number as
an answer.

This leads to an insight: `x^2 = 1 * x * x` will always be positive - even if x is
a negative number. Here, we can see the graph of x^2:

---
> id: imag

At this point, we might start thinking that `x^2 + 1 = 0` has no solutions. But we
have been through similar challenges when we discovered negative numbers, and
fractions and then radicals. We had to change our definition of addition and 
multiplication again and again. No reason to give up now. What kind of change in
our concept of a number do we need so that negative numbers could have square
roots?

So, the question now becomes what operation we can repeat two times that takes 
1 to -1? Flipping across 0 is not it because it brings us back to 1. This was the
question that troubled many famous mathematicians. And then came an idea: What if
we thinking of multiplication stretch/squeeze + rotation? After all, flip is nothing
but rotation of half a circle.

So rotation by a right-angle is exactly the operation we need. This repeated two times
takes us to -1. But what do we call one rotation by a right angle? This point is not
even on our number line! Does it even exist?

---
> id: iunit

We now must go beyond the number line to a number plane. This number is called the unit
_imaginary_ number and is written as _i_. And we have seen that `i^2 = -1`.

This name _imaginary_ is unfortunately, misleading. This is what Gauss said:


We still have to make a decision: is out one right-angle rotation made clockwise or
anti-clockwise? Historically, mathematicians have picked anti-clockwise direction as
the __positive__ direction of rotation. So _i_ would lie one unit above zero. We call
this the _imaginary_ line. The mirror image of _i_ would be _-i_.

Once we have 0 and a unit imaginary number, by sliding and stretching/squeezing, we get 
the complete imaginary line with numbers like _2i_, _3i_, _100i_, _-4i_, `0.5i`, `sqrt(3)i`
and so on. Every imaginary number is some real number times `i`.

Because 0 lies on both the real line and the imaginary line, it's both a real number
and an imaginary number. 

These imaginary numbers let us solve equations like:
`sqrt(-9) = 3i`

---
## The Complex Plane

> section: complexplane
> id: complexplane

Once we have the concept of moving sideways (along the imaginary line), every single point in
the plane becomes reachable to us. For example, we can move 3 units along the real line
and 4 units along the imaginary line to reach this point P. We can denote the location of P
as a pair of numbers (3,4). Or more commonly, `3+4i`.

These points are _numbers_ and we will call them __complex numbers__. The 3 is the _real_ part and
`4i` is the imaginary part.

These are numbers because we still have a notion of adding (sliding) and multiplying (stretching + rotating).

For eg:

`(1-2i) + (3+4i) = (4+2i)`
`(1+i)*(1-i) = 2`

In general:

`(a+bi)*(c+di) = (ac-bd) + (ad+bc)i`

and:

`1 / (a+bi) = (a - bi)/(a^2 + b^2)`


---
## Modulus and Argument

> section: modarg
> id: modarg

We say that every point in the plane can be identified with a pair of numbers (x,y). x
is the distance along real-axis and y is the distance along imaginary axis.

But there is another way of describing the same point P! We can use (r,theta) where r
is the distance from origin and theta is the angle made with the real-line.

There is a very famous identity which connects these two represetations:

`re^(i*theta) = r*cos(theta) + i r*sin(theta)`

You can see this for yourself by applying the pythagoras theorem:

`r = sqrt(x^2 + y^2)`
`tan(theta) = y/x`


---
## Quadratic, Cubic and Quartic Equations

> section: quartic
> id: quartic


Now, that we have imaginary and complex numbers in our arsenal, we can solve any quadratic 
equation. Take `x^2 + 6 = 0`. If x is restricted to be on the real-line, the expression
`x^2 + 6` is always higher than 6 and so, it never crosses the x-axis. 

But if we allow x to be a complex number, then a much richer picture emerges:

And just like earlier, this quadratic equation has two roots:



---
## Euler's Identity and DeMoivre's Theorem

> section: euler
> id: euler

sdf

---
## Complex Roots of Unity

> section: roots
> id: roots

sdf

--- 
## Component Staging
    
    include ./components/complextransform
    x-complex-transform
    
---