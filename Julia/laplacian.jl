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

function getiterk(Q,b,α)
  Σ,U = eig(Q)
  c = U'b
  lambdak(k,λ) = (1 - (1 - α*λ).^k)./λ
  return k -> U*(lambdak(k,Σ).*c)
end

Box = zeros(16,16)
Cavity = ones(16,16)
Cavity[8:9,:] = 0
R = [Box Cavity Box Cavity Box Cavity Box]
A = ones(size(R,1)+2, size(R,2) + 2)
A[2:end-1,2:end-1] = R

n = size(A,1) - 2
m = size(A,2) - 2

Ind = zeros(Integer, size(A))
IndInv = Tuple{Int64,Int64}[]
count = 1
for i = 1:size(A,1), j = 1:size(A,2)
  if A[i,j] == 0
    Ind[i,j] = count
    push!(IndInv, (i,j))
    count = count + 1
  end
end

fp = open("Uval.json","w")
JSON.print(fp, convert(Array{Float16,2},U))
close(fp)

fp = open("Sigma.json","w")
JSON.print(fp, Σ)
close(fp)
# ==================================================
# Generate Laplacian
# ==================================================

Q = zeros(length(IndInv), length(IndInv))
for i = 2:(size(A,1)-1), j = 2:(size(A,2)-1)
  k = Ind[i,j]
  if A[i,j] == 0
    A[i,j+1] == 0 ? Q[Ind[i,j+1],k] = 1 : nothing
    A[i+1,j] == 0 ? Q[Ind[i+1,j],k] = 1 : nothing
    A[i,j-1] == 0 ? Q[Ind[i,j-1],k] = 1 : nothing
    A[i-1,j] == 0 ? Q[Ind[i-1,j],k] = 1 : nothing
  end
end

Q = (Q + Q')/2
L = diagm(sum(Q,1)[:]) - Q
L[449,449] = L[449,449] + 0.1
L[561,561] = L[561,561] + 0.1

Σ,U = eig(L)

function arrange(x)
  A = zeros(n,m)
  for ind = 1:length(x)
    i,j = IndInv[ind]
    A[i-1,j-1] = x[ind]
  end
  return A
end

plot(size = (880,140)); heatmap!(arrange(U[:,10]), map = "seismic")

imshow(arrange(U[:,100]), interpolation = "None", cmap = "spectral"); show()

pyplot(leg=false, ticks=nothing)

@gif for i in 2:500
  plot(size = (880,140)); heatmap!(reshape(U[:,224*3+i],n,m))
end

e1 = zeros(length(IndInv))
e1[449] = 1
e1[561] = 1

α = 1/max(Σ...)

iterk = getiterk(L,e1,α)

imshow(arrange(iterk(10000)))
show()

# α = 1/max(eig(L)[1]...)
# iters = 5000
# X = zeros(n*m,iters)
# x = 10*zeros(n*m)
# for i = 1:iters
#   X[:,i] = x
#   for i = 1:100
#     x = x - (1*α)*(L*x - e1)
#   end
#   println(norm(L*x - e1))
# end

# plot(size = (880,140)); heatmap!(reshape(X[:,100],n,m))
# pyplot(leg=false, ticks=nothing)

# @gif for i in 10:10:2000
#   println(i)
#   xi = reshape(X[:,i],n,m)
#   plot(size = (880,140)); heatmap!(xi)
# end

# lambdak(k,λ) = α*(1 - (1 - α*λ).^k)./(α*λ)
# c = U'e1

# @gif for i i guein 10:500:300000
#   println(i)
#   z = U*(lambdak(i,Σ).*(c)
#   plot(size = (880,140)); heatmap!(reshape(z, n, m))
# end

# A = randn(10,10); A = A*A'

# b = rand(10)
# x = zeros(10)
# for i = 1:1000
#   x = x - 0.01*(A*x - b)
# end
# x - getiterk(A,b,0.01)(1000)

