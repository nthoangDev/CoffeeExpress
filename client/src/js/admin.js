// src/js/admin.js
import { auth, db } from './firebase-config.js';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, where, query } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import { checkSession } from './check-session.js';

let userSession = JSON.parse(localStorage.getItem('user_session'));
checkSession();

document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!userSession) {
      alert("Vui lòng đăng nhập để truy cập!");
      window.location.href = "./index.html";
      return;
    }

    const email = userSession.user.email;
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("Không tìm thấy người dùng!");
      window.location.href = "./index.html";
      return;
    }

    querySnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.role_id !== 1) {
        alert("Bạn không có quyền truy cập!");
        window.location.href = "./index.html";
      }
    });

    await loadProducts();
  } catch (error) {
    console.error("Lỗi khi kiểm tra quyền truy cập:", error);
    alert("Có lỗi xảy ra khi kiểm tra quyền truy cập!");
  }
});

// Thêm sản phẩm 
// document.getElementById('product-form').addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const productName = document.getElementById("product_name").value;
//   const productPrice = document.getElementById("product_price").value;
//   const productImage = document.getElementById("product_image").files[0];

//   if (!productName || !productPrice || !productImage) {
//     alert("Vui lòng điền đầy đủ thông tin!");
//     return;
//   }

//   try {
//     // Tạo một đối tượng FormData để gửi dữ liệu dạng multipart/form-data
//     const formData = new FormData();
//     // Thêm file ảnh (productImage) vào FormData với key là "image"
//     formData.append("image", productImage);

//     // Gửi yêu cầu HTTP POST đến endpoint "http://localhost:3000/upload"
//     // Đây là một API giả định sẽ được phát triển sau để xử lý upload ảnh 
//     const response = await fetch("http://localhost:3000/upload", { // Phát triển sau
//       method: "POST",
//       body: formData,
//       // Lưu ý: Không cần set header "Content-Type" vì fetch tự động set multipart/form-data khi dùng FormData
//     });

//     // Phản hồi từ server (response) trả về thông tin file đã upload
//     const result = await response.json();

//     // Kiểm tra xem trong kết quả trả về có thuộc tính "data.secure_url" hay không
//     // "data.secure_url" thường là URL của ảnh đã upload thành công (ví dụ từ Cloudinary)
//     if (!result.data?.secure_url) {
//       throw new Error("Upload ảnh thất bại!");
//     }

//     await addDoc(collection(db, "products"), {
//       name: productName,
//       price: parseFloat(productPrice),
//       imageUrl: result.data.secure_url,
//       createdAt: serverTimestamp(),
//     });

//     alert("Thêm sản phẩm thành công!");
//     document.getElementById("product-form").reset();
//     await loadProducts();
//   } catch (error) {
//     console.error("Lỗi khi thêm sản phẩm:", error);
//     alert("Có lỗi xảy ra khi thêm sản phẩm!");
//   }
// });

//Thêm sản phẩm tạm thời => không có trường image => vì chưa phát triển server


document.getElementById('product-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const productName = document.getElementById("product_name").value;
  const productPrice = document.getElementById("product_price").value;
  // const productImage = document.getElementById("product_image").files[0]; // Bỏ qua ảnh

  if (!productName || !productPrice) { // Loại bỏ kiểm tra productImage
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    await addDoc(collection(db, "products"), {
      name: productName,
      price: parseFloat(productPrice),
      imageUrl: "", // Để trống hoặc dùng URL mặc định
      createdAt: serverTimestamp(),
    });

    alert("Thêm sản phẩm thành công!");
    document.getElementById("product-form").reset();
    await loadProducts();
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    alert("Có lỗi xảy ra khi thêm sản phẩm!");
  }
});

// Hiển thị sản phẩm 
async function loadProducts() {
  try {
    const productTableBody = document.getElementById("product-list");
    let htmls = "";
    let index = 1;
    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      htmls += `
        <tr class="product-item text-center">
          <th>${index}</th>
          <td><img src="${product.imageUrl}" alt="${product.name}"></td>
          <td>${product.name}</td>
          <td>${product.price.toLocaleString('vi-VN')} VND</td>
          <td>
            <button class="btn btn-danger btn-sm btn-delete-product rounded-sm" data-id="${doc.id}">Xóa</button>
          </td>
        </tr>
      `;
      index++;
    });

    productTableBody.innerHTML = htmls;

    document.querySelectorAll(".btn-delete-product").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const productId = btn.getAttribute("data-id");
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
          try {
            await deleteDoc(doc(db, "products", productId));
            alert("Xóa sản phẩm thành công!");
            await loadProducts();
          } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            alert("Có lỗi xảy ra khi xóa sản phẩm!");
          }
        }
      });
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách sản phẩm:", error);
  }
}

loadProducts();