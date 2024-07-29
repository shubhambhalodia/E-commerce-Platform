import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import search from "../../images/search (1).png";
const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const data = await axios.get(
        `http://localhost:8080/api/v1/product/search/${values.keyword}`
      );
      console.log("products ", data.data.products);
      setValues({ ...values, results: data.data.products });
      //   console.log("values"+values.results);
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          className="btn"
          type="submit"
          style={{
            position: "absolute",
            right: "40px",
            background: "#000rgb(20 201 201)",
          }}
        >
          <img src={search} alt="search" style={{ width: "20px" }} />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
