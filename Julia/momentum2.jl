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