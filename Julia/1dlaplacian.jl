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