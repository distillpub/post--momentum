#=Copyright (c) 2017 Gabriel Goh

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.=#

A = diagm(Float64[i^2 for i = 1:10])
x = ones(10)
y = ones(10)
L = min(eig(A)[1]...)

β = 0.9999
α = 0.000005
X = zeros(10,10000)
fX = zeros(10000)
fx = vecdot(x,A*x)

for i = 1:10000
    xold = x
    fxp = fx
    fx = 0.5*vecdot(x,A*x)
    x = y - α*(A*y)
    fxp < fx ? y = x : y = x + β*(x - xold)
    X[:,i] = x
    fX[i] = 0.5*vecdot(x,A*x)
end

plot(fX)

x = ones(10)
y = ones(10)

for i = 1:10000
    xold = x
    fxp = fx
    fx = 0.5*vecdot(x,A*x)
    x = y - α*(A*y)
    y = x + β*(x - xold)
    X[:,i] = x
    fX[i] = 0.5*vecdot(x,A*x)
end

plot(fX)