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

using Plots

# A = ones(18,67)

# A[2:end-1,2:end-1] = 0
# A[1:7,32-5:34+5] = 1
# A[end-7:end,32-5:34+5] = 1

Box = zeros(16,16)
Cavity = ones(16,16)
Cavity[8:9,:] = 0
R = [Box Cavity Box Cavity Box Cavity Box]
A = ones(size(R,1)+2, size(R,2) + 2)
A[2:end-1,2:end-1] = R

n = size(A,1) - 2
m = size(A,2) - 2

R = reshape(1:n*m, n,m)
Id(i,j) = R[i-1,j-1]

Q = zeros(n*m,n*m)
for i = 2:(size(A,1)-1), j = 2:(size(A,2)-1)
  k = Id(i,j)
  if A[i,j] == 0
    A[i,j+1] == 0 ? Q[Id(i,j+1),k] = 1 : nothing
    A[i+1,j] == 0 ? Q[Id(i+1,j),k] = 1 : nothing
    A[i,j-1] == 0 ? Q[Id(i,j-1),k] = 1 : nothing
    A[i-1,j] == 0 ? Q[Id(i-1,j),k] = 1 : nothing
  end
end

Q = (Q + Q')/2

v = sum(Q,1)[:]
v[v .== 0] = 1
L = diagm(v) - Q
L[1,1] = 2.1

Σ,U = eig(L)

pyplot(leg=false, ticks=nothing)
@gif for i in 2:500
  plot(size = (880,140)); heatmap!(reshape(U[:,224*3+i],n,m))
end

e1 = zeros(n*m)
e1[8:9] = 1

α = 1/max(eig(L)[1]...)
iters = 5000
X = zeros(n*m,iters)
x = 10*zeros(n*m)
for i = 1:iters
  X[:,i] = x
  for i = 1:100
    x = x - (1*α)*(L*x - e1)
  end
  println(norm(L*x - e1))
end

plot(size = (880,140)); heatmap!(reshape(X[:,100],n,m))
pyplot(leg=false, ticks=nothing)

@gif for i in 10:10:2000
  println(i)
  xi = reshape(X[:,i],n,m)
  plot(size = (880,140)); heatmap!(xi)
end


lambdak(k,λ) = α*(1 - (1 - α*λ).^k)./(α*λ)
c = U'e1


@gif for i in 10:500:300000
  println(i)
  z = U*(lambdak(i,Σ).*(c)
  plot(size = (880,140)); heatmap!(reshape(z, n, m))
end

function getiterk(Q,b)
  Σ,U = eig(Q)
  c = U'b
  lambdak(k,λ) = α*(1 - (1 - α*λ).^k)./(α*λ)
  return U*(lambdak(k,Σ).*c)
end


