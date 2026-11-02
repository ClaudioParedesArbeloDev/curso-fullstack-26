import { useState, useEffect } from "react"
import { getProducts } from "../api/productos"

const Home = () => {
    
    const [products, setProducts] = useState([])

    useEffect(()=>{
        getProducts()
            .then(setProducts)   
    },[])

        

    return(
        <div>
           <h1>Productos</h1>

           {products.map((product) => (
                <div key={product.id}>
                    <p>{product.nombre}</p>
                    <p>{product.precio}</p>

                </div>
                
           )

           )}
        </div>
    )

}

export default Home