import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Product } from './products'; // Keeping the Product type definition

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      // Map from snake_case database to camelCase frontend
      if (data) {
        const mappedProducts: Product[] = data.map(item => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          tagline: item.tagline,
          description: item.description,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : null,
          image: item.image,
          badge: item.badge,
          variants: item.variants || [],
          features: item.features || [],
          isWaitlist: item.is_waitlist,
          sku: item.sku,
          stock: item.stock,
          manufacturingCost: Number(item.manufacturing_cost),
          shippingCost: Number(item.shipping_cost),
          packagingCost: Number(item.packaging_cost),
          isStandalone: item.is_standalone,
          isCustomBox: item.is_custom_box,
          isDeleted: item.is_deleted
        }));
        setProducts(mappedProducts.filter(p => !p.isDeleted));
        setArchivedProducts(mappedProducts.filter(p => p.isDeleted));
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (id: number, amount: number) => {
    // Optimistic update
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const newStock = Math.max(0, product.stock + amount);
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));

    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating stock:', err);
      // Revert on error
      fetchProducts();
    }
  };

  const addProduct = async (newProduct: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          slug: newProduct.slug,
          name: newProduct.name,
          tagline: newProduct.tagline,
          description: newProduct.description,
          price: newProduct.price,
          original_price: newProduct.originalPrice,
          image: newProduct.image,
          badge: newProduct.badge,
          variants: newProduct.variants,
          features: newProduct.features,
          is_waitlist: newProduct.isWaitlist || false,
          sku: newProduct.sku,
          stock: newProduct.stock,
          manufacturing_cost: newProduct.manufacturingCost,
          shipping_cost: newProduct.shippingCost,
          packaging_cost: newProduct.packagingCost,
          is_standalone: newProduct.isStandalone !== false, // Default to true if undefined
          is_custom_box: newProduct.isCustomBox || false
        }])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        // Refetch to get correct ID and all formatted data
        fetchProducts();
      }
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const requestPriceChange = async (productId: number, userId: string, requestedPrice: number) => {
    try {
      const { error } = await supabase
        .from('price_requests')
        .insert([{
          product_id: productId,
          requested_by: userId,
          requested_price: requestedPrice,
          status: 'pending'
        }]);

      if (error) throw error;
    } catch (err) {
      console.error('Error requesting price change:', err);
      throw err;
    }
  };

  const fetchPriceRequests = async () => {
    const { data, error } = await supabase
      .from('price_requests')
      .select(`
        id,
        requested_price,
        status,
        created_at,
        products ( id, name, price, sku ),
        profiles ( email )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const approvePriceRequest = async (requestId: number, productId: number, newPrice: number) => {
    const { error: updateProductError } = await supabase
      .from('products')
      .update({ price: newPrice })
      .eq('id', productId);
      
    if (updateProductError) throw updateProductError;

    const { error: updateReqError } = await supabase
      .from('price_requests')
      .update({ status: 'approved' })
      .eq('id', requestId);

    if (updateReqError) throw updateReqError;
    
    fetchProducts();
  };

  const rejectPriceRequest = async (requestId: number) => {
    const { error } = await supabase
      .from('price_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw error;
  };

  const fetchPurchases = async () => {
    const { data, error } = await supabase
      .from('inventory_purchases')
      .select('*, products(name)')
      .order('purchase_date', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  const logPurchase = async (productId: number, boxesPurchased: number, itemsPerBox: number, totalCost: number, notes?: string) => {
    try {
      // 1. Insert the purchase log
      const { error: purchaseError } = await supabase
        .from('inventory_purchases')
        .insert([{
          product_id: productId,
          boxes_purchased: boxesPurchased,
          items_per_box: itemsPerBox,
          total_cost: totalCost,
          notes: notes
        }]);

      if (purchaseError) throw purchaseError;

      // 2. Automatically update the product's stock and cost
      const totalYield = boxesPurchased * itemsPerBox;
      const unitCost = totalCost / totalYield;
      
      const product = products.find(p => p.id === productId);
      if (product) {
        // Optimistic update
        const newStock = product.stock + totalYield;
        // Basic weighted average or simple overwrite for manufacturingCost. 
        // For simplicity, we'll overwrite it to the latest unit cost.
        setProducts(products.map(p => p.id === productId ? { 
          ...p, 
          stock: newStock,
          manufacturingCost: unitCost
        } : p));

        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock: newStock,
            manufacturing_cost: unitCost 
          })
          .eq('id', productId);

        if (updateError) throw updateError;
      }
    } catch (err) {
      console.error('Error logging purchase:', err);
      throw err;
    }
  };

  const fetchComponents = async (productId: number) => {
    const { data, error } = await supabase
      .from('product_components')
      .select('id, quantity_needed, component_product:products!product_components_component_product_id_fkey(id, name, stock, manufacturing_cost, sku)')
      .eq('parent_product_id', productId);
    
    if (error) throw error;
    return data;
  };

  const addComponent = async (parentId: number, componentId: number, quantity: number) => {
    const { error } = await supabase
      .from('product_components')
      .insert([{
        parent_product_id: parentId,
        component_product_id: componentId,
        quantity_needed: quantity
      }]);
      
    if (error) throw error;
  };

  const removeComponent = async (componentRowId: number) => {
    const { error } = await supabase
      .from('product_components')
      .delete()
      .eq('id', componentRowId);
      
    if (error) throw error;
  };

  const deleteProduct = async (productId: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: true })
        .eq('id', productId);
      
      if (error) throw error;
      
      await fetchProducts();
    } catch (err) {
      console.error('Error archiving product:', err);
      throw err;
    }
  };

  const unarchiveProduct = async (productId: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_deleted: false })
        .eq('id', productId);
      
      if (error) throw error;
      
      await fetchProducts();
    } catch (err) {
      console.error('Error unarchiving product:', err);
      throw err;
    }
  };

  return { 
    products, 
    archivedProducts,
    loading, 
    error, 
    updateStock, 
    addProduct,
    deleteProduct,
    requestPriceChange, 
    fetchPriceRequests,
    approvePriceRequest,
    rejectPriceRequest,
    fetchPurchases,
    logPurchase,
    fetchComponents,
    addComponent,
    removeComponent,
    refreshProducts: fetchProducts 
  };
}
