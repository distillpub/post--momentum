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