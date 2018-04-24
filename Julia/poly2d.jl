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

gen_rand2(n,x) = [(0.1*randn(n,1) + x[1]) (0.1*randn(n,1) - x[2])]

X = [gen_rand2(12, [1,0.7]);
     gen_rand2(12, [-1,0.7]);
     gen_rand2(12, [0,-1])];

scatter(X[:,1], X[:,2])

function Φ(x)
  o = Float64[]
  for i = 0:5, j = 0:5
    push!(o, (x[1]^i)*x[2]^j )
  end
  return o
end

res = 500
Z = [Φ([i,j])[10] for i = linspace(-1,1,res), j = linspace(-1,1,res)]

D = cat(2,[Φ(X[i,:]) for i = 1:size(X,1)]...)
S,U = eig(D*D')

n = 3
Z = [vecdot(Φ([i,j]),U[:,n]) for i = linspace(-2,2,res), j = linspace(-2,2,res)]
c = 0.1*sqrt(S[n])
#heatmap(linspace(-2,2,res),linspace(-2,2,res),min(max(Z,-c),c))
heatmap(linspace(-2,2,res),linspace(-2,2,res),log(abs(Z)))
scatter!(X[:,2], X[:,1])