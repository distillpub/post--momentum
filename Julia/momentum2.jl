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

srand(1)

n = 2
U = [1 -1;1 1]/sqrt(2); L = [1 0; 0 2]; 
A = U*L*inv(U)
b = -ones(n)

β = 0.4
α = 1/max(eig(A)[1]...)

function runmomentum(A,b,k)
  z = zeros(length(b))
  w = zeros(length(b))
  for i = 1:k
    z = β*z + (A*w - b)
    w = w - α*z
  end
  return (z,w)
end

function geosumgen(R) 
  Λ, U = eig(R)
  (b,k) -> begin; 
    Λsum = (1./(1 - Λ)).*(1 - Λ.^k); 
    real(U*(Λsum.*(U\b))); 
  end
end

function runmomentumcheat(A,b,k)
  Λ, U = eig(A)
  Rmat(i) = [    β        Λ[i]  ;
              -α*β  (1- α*Λ[i]) ]
  S = inv([ 1  0 ;
            α  1 ])
  c = -U'b
  fcoll = [geosumgen(Rmat(i)) for i = 1:length(b)]
  iters = [fcoll[i](S*[c[i];0],k) for i = 1:length(b)]
  catiter = cat(2,iters...)
  return (U*catiter[1,:], U*catiter[2,:])
end

(a1,b1) = runmomentum(A,b,4)
(a2,b2) = runmomentumcheat(A,b,4)

norm(a1)