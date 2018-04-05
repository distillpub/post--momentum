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

n = 50
κ = 1000
A = SymTridiagonal(2*ones(n), -ones(n-1))
A = (κ-1)*A/4 + eye(n)
cond(A)
b = zeros(n); b[1] = (κ - 1)/4

Λ, Q = eig(A)

κ = Λ[1]/Λ[n]
α = 2/(Λ[1] + Λ[end])
β = 0.98
#β = 0

# Function from momentum2.jl
Z = cat(2,[ runmomentumcheat(A,b,i)[2] for i = 1:400]...)
heatmap(Z)

plot(b2)
plot!(A\b)