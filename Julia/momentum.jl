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

λ = 1
#M(α,β) = [β λ; -α*β (1-α)]
M(α,β) = [β λ; -α*(β^2) 1-α*λ*(1+β)]
#M(α,β) = [1 αλ; -β-1 -α*β*λ]
S(α,β) = max(abs((eig(M(α,β))[1]))...)

n = 200
R1 = linspace(0,2,n); 
R2 = linspace(-1,1,2*n); 
Z = [S(R1[i],R2[j]) for i = 1:n, j = 1:2*n]

figure(); contour(R1, R2, Z', linspace(0,1,30), cmap = "magma")
contour(R1, R2, Z', [1.,])

# figure(); imshow(flipdim(Z',1), cmap = "magma")


xlabel(L"\alpha\lambda_i")
ylabel(L"\beta")

figure(); plot(R2, Z[6,:]',"k")
xlabel(L"\beta")
ylabel("Convergence Rate")