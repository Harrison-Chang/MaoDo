
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://hxuqdbcynczypjursobn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dXFkYmN5bmN6eXBqdXJzb2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzA2MzUsImV4cCI6MjA2NDc0NjYzNX0.A12PWHsYdMz84BI5tdNojfCHJSOWnRIrsyiy3ZDq3v8"
);

const productList = document.getElementById("productList");
const brandFilter = document.getElementById("brandFilter");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

async function fetchProducts() {
  let { data: products } = await supabase.from("products").select("*");

  const brand = brandFilter.value;
  const category = categoryFilter.value;
  const keyword = searchInput.value.trim().toLowerCase();

  if (brand) {
    products = products.filter(p => p.brand === brand);
  }
  if (category) {
    products = products.filter(p => p.category === category);
  }
  if (keyword) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(keyword)
    );
  }

  productList.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>價格：${p.price}</p>
      <p>廠牌：${p.brand}</p>
      <p>分類：${p.category}</p>
    </div>
  `).join("");
}

async function populateFilters() {
  const { data } = await supabase.from("products").select("brand, category");
  const brands = [...new Set(data.map(p => p.brand))];
  const categories = [...new Set(data.map(p => p.category))];

  brandFilter.innerHTML += brands.map(b => `<option value="${b}">${b}</option>`).join("");
  categoryFilter.innerHTML += categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

brandFilter.addEventListener("change", fetchProducts);
categoryFilter.addEventListener("change", fetchProducts);
searchInput.addEventListener("input", fetchProducts);

populateFilters();
fetchProducts();
setInterval(fetchProducts, 10000); // 每 10 秒更新一次
