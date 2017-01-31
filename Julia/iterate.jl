A = diagm(Float64[i^2 for i = 1:10])
x = ones(10)
y = ones(10)
L = min(eig(A)[1]...)

β = 0.9999
α = 0.000005
X = zeros(10,10000)
fX = zeros(10000)
fx = vecdot(x,A*x)

for i = 1:10000
    xold = x
    fxp = fx
    fx = 0.5*vecdot(x,A*x)
    x = y - α*(A*y)
    fxp < fx ? y = x : y = x + β*(x - xold)
    X[:,i] = x
    fX[i] = 0.5*vecdot(x,A*x)
end

plot(fX)

x = ones(10)
y = ones(10)

for i = 1:10000
    xold = x
    fxp = fx
    fx = 0.5*vecdot(x,A*x)
    x = y - α*(A*y)
    y = x + β*(x - xold)
    X[:,i] = x
    fX[i] = 0.5*vecdot(x,A*x)
end

plot(fX)