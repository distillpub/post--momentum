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

using ConicIP

set_default_solver(ConicIPSolver(optTol = 1e-10))

b = 0.5*ones(10)

function Ψ(λ)
  x = Variable(15)
  p = minimize( 0.5*sumsquares(A*x - b) + λ*norm(y,1) )
  solve!(p)
  s = y.value
  s[abs(s) .< 1e-8] = 0
  return s
end

x = 0.5*ones(10)
W = randn(10,15)
I = eye(10)
ϵ = 0.001

K = !(Ψ(x) .== 0)
ystar = Ψ(x)
inv(W[:,K]'W[:,K])*(W[:,K]'x - sign(ystar[K]))
Ψ(x)

(Ψ(x + ϵ*I[:,1]) - Ψ(x - ϵ*I[:,1]))/(2ϵ)

inv(W[:,K]'W[:,K])*(W[:,K]')

