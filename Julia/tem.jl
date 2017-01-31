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

