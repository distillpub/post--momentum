n = 2000
κ = 10000
A = SymTridiagonal(2*ones(n), -ones(n-1))
A = (κ-1)*A/4 + eye(n)
cond(A)
b = zeros(n); b[1] = (κ - 1)/4

Λ, Q = eig(A)

α = 2/(Λ[1] + Λ[end])
β = 1 - sqrt(α*Λ[1])
#β = 0

# Function from momentum2.jl
(a2,b2) = runmomentumcheat(A,b,256)
plot(b2)
plot!(A\b)