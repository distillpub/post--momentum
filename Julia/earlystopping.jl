csize = 5;
y = [-1*ones(csize); 1*ones(csize); -1*ones(csize);1*ones(csize);-1*ones(csize);]
y = y + 0.3*cat(1, [[0,1,0,1,0] for i in 1:5]...)
x = cat(1,[collect(c + linspace(-0.03,0.03, csize)) for c in linspace(-1,1,5)]...)

pdegree = 25

# Construct Vander* Matrix
A = zeros(length(y),pdegree+1)
for i = 1:size(A,1), j = 1:size(A,2)
	A[i,j] = x[i]^(j-1)
end

Σ,U = eig(A'A)

p(w,x) = sum([w[i]*x^(i-1) for i = 1:length(w)])

Q,R = qr(A)
ws = (R'R)\(A'*y)
plot(r,[p(ws,i) for i in r])
plot!(ylim = [-2,2])
scatter!(x,y)

r = linspace(x[1]-0.1,1+0.1,500)

w = 100*randn(size(w))
α = 1/max(eig(A'A)[1]...)

# for ind = 1:2
#   plot!(r,[(U'*ws)[ind]*p(U[:,ind],i) for i in r])
# end
# plot!(ylim = [0,15])
# scatter!(x,y)

@gif for i = 1:100
  println(i)
  w = getiterk(A'A, A'y, α)(1.4^i)
  println(norm(A'*(A*w - y)))
  plot(size = (880,180))  
  scatter!(x,y)
  plot!(r,[p(w,i) for i in r])
  plot!(ylim = [-2,2])
end
