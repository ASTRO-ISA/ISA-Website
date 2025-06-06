
import StarBackground from "@/components/StarBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Shop = () => {
  const products = [
    {
      id: 1,
      name: "Beginner Telescope Kit",
      price: "$129.99",
      image: "https://plus.unsplash.com/premium_photo-1709552913565-a3a6a58ff274?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Equipment"
    },
    {
      id: 2,
      name: "Cosmos: A Personal Voyage",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=500",
      category: "Books"
    },
    {
      id: 3,
      name: "Solar System 3D Model",
      price: "$49.99",
      image: "https://images.unsplash.com/photo-1681405203174-240c946cf06e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8M2QlMjBtb2RlbCUyMHNvbGFyJTIwc3lzdGVtfGVufDB8fDB8fHww",
      category: "Models"
    },
    {
      id: 4,
      name: "Star Map Constellation Poster",
      price: "$19.99",
      image: "https://images.unsplash.com/photo-1535393857990-03242fe70580?q=80&w=500",
      category: "Posters"
    },
    {
      id: 5,
      name: "Astronomy Binoculars",
      price: "$89.99",
      image: "https://images.unsplash.com/photo-1495542779398-9fec7dc7986c?q=80&w=500",
      category: "Equipment"
    },
    {
      id: 6,
      name: "The Planets by Brian Cox",
      price: "$32.99",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=500",
      category: "Books"
    },
    {
      id: 7,
      name: "Space Explorer T-Shirt",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=500",
      category: "Apparel"
    },
    {
      id: 8,
      name: "Night Sky Photography Guide",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=500",
      category: "Books"
    }
  ];

  const categories = ["All", "Equipment", "Books", "Models", "Posters", "Apparel"];

  return (
    <div className="min-h-screen bg-space-dark text-white">
      {/* <StarBackground /> */}
      {/* <Navbar /> */}
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Space Marketplace</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover astronomical equipment, books, and space-themed merchandise.
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full transition-colors ${
                index === 0 
                  ? 'bg-space-accent text-white' 
                  : 'bg-space-purple/20 text-white hover:bg-space-purple/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="cosmic-card overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-space-accent/90 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1 text-white">{product.name}</h3>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xl font-bold text-space-accent">{product.price}</span>
                  <button className="bg-space-purple/30 hover:bg-space-purple/50 text-white px-3 py-1 rounded transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <button className="inline-flex items-center justify-center px-6 py-3 bg-space-accent hover:bg-space-accent/80 text-white rounded-md text-lg font-medium transition-colors">
            View All Products
          </button>
        </div>
      </main>
      
      {/* <Footer /> */}
    </div>
  );
};

export default Shop;
