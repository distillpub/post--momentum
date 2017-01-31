
# α = 0.076
# β = 0.513

α = 0.2
β = 0.99
x = 2
y = 0
X = zeros(100)
for i = 1:100
    y  = β*y - x
    x  = x - α*y
    X[i] = x
end
figure(); plot(X,"k"); plot(X,"k."); xlabel(L"k"); ylabel(L"f(x)")