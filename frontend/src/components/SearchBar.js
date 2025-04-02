//html for searchbar and cateogry buttons
const SearchBar = ({ searchQuery, setSearchQuery, sortByName, sortByCategory, selectedCategory }) => {
  return (
    <div>
      {/* Search & Categories */}
      <section className="mb-5 text-center">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="input-group" style={{ maxWidth: "500px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Find products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-warning" onClick={sortByName}>
              Search
            </button>
          </div>
        </div>
        <div className="d-flex justify-content-center flex-wrap gap-2">
          {["Cakes", "Cookies", "Bread", "Pastries", "Muffins", "Other", "All"].map(
            (category) => (
              <button
                key={category}
                className={`btn me-2 mb-2 ${
                  selectedCategory === category
                    ? "btn-warning"
                    : "btn-outline-warning"
                }`}
                onClick={() => sortByCategory(category)}
              >
                {category}
              </button>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchBar;
