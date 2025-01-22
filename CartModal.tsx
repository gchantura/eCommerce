{cartItems?.map((product) => (
  <div key={product.id}>
    {/* ... other JSX ... */}
    <span>${(Number(product.price) || 0).toFixed(2)}</span>
    {/* ... other JSX ... */}
  </div>
))} 