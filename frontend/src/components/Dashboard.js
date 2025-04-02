import { Link } from 'react-router-dom';

const Dashboard = () => {
    
    return (
        <div className="container">
            {/* Hero Section */}
            <section className="bg-light text-center py-5 mb-4">
                <div className="py-5">
                    <h2 className="display-4 fw-bold mb-4">
                        Freshly Baked Happiness, Delivered to Your Door.
                    </h2>
                    <p className="lead mb-4">
                        Discover homemade treats from passionate local bakers.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        {/* Sign into User Account */}
                        <Link to="/login" className="btn btn-warning btn-lg">
                            Shop Now
                        </Link>
                        {/* Sign into Admin account */}
                        <Link to="/admin" className="btn btn-outline-warning btn-lg me-2">
                            Become a Seller
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section*/}
            <section className="bg-light py-5 text-center mb-4">
                <h3 className="display-6 fw-bold mb-4">How It Works</h3>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-3">1. Browse Products</h4>
                                <p className="card-text">Explore categories and discover unique homemade goods.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-3">2. Place Your Order</h4>
                                <p className="card-text">Add your favorites to the cart and checkout easily.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 bg-transparent">
                            <div className="card-body">
                                <h4 className="card-title fw-bold mb-3">3. Get It Delivered</h4>
                                <p className="card-text">Enjoy fresh baked goods delivered straight to your door.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    ); 
};

export default Dashboard;