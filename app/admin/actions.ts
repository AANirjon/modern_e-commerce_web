'use server';

import { supabaseAdmin } from '@/lib/supabase';

// Server-side image upload function using admin client (bypasses RLS)
export async function uploadProductImageAction(
    fileData: ArrayBuffer,
    fileName: string,
    productId: string
) {
    try {
        const fileExt = fileName.split('.').pop();
        const filePath = `${productId}-${Date.now()}.${fileExt}`;

        // Convert ArrayBuffer to Uint8Array for upload
        const uint8Array = new Uint8Array(fileData);

        const { error } = await supabaseAdmin.storage
            .from('products')
            .upload(filePath, uint8Array, {
                cacheControl: '3600',
                upsert: false,
                contentType: `image/${fileExt}`,
            });

        if (error) throw error;

        // Get signed URL that's valid for 1 year (31536000 seconds)
        const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
            .from('products')
            .createSignedUrl(filePath, 31536000);

        if (signError) throw signError;

        return {
            success: true,
            path: filePath,
            url: signedUrlData?.signedUrl || '',
        };
    } catch (error) {
        console.error('Error uploading product image:', error);
        throw error;
    }
}

// Server-side image delete function using admin client (bypasses RLS)
export async function deleteProductImageAction(imagePath: string) {
    try {
        if (!imagePath) return { success: true };

        const { error } = await supabaseAdmin.storage
            .from('products')
            .remove([imagePath]);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting product image:', error);
        throw error;
    }
}

// Server-side image upload function for explore sections using admin client (bypasses RLS)
export async function uploadExploreImageAction(
    fileData: ArrayBuffer,
    fileName: string,
    sectionId: string
) {
    try {
        const fileExt = fileName.split('.').pop();
        const filePath = `${sectionId}-${Date.now()}.${fileExt}`;

        // Convert ArrayBuffer to Uint8Array for upload
        const uint8Array = new Uint8Array(fileData);

        const { error } = await supabaseAdmin.storage
            .from('explore-sections')
            .upload(filePath, uint8Array, {
                cacheControl: '3600',
                upsert: false,
                contentType: `image/${fileExt}`,
            });

        if (error) throw error;

        // Get signed URL that's valid for 1 year (31536000 seconds)
        const { data: signedUrlData, error: signError } = await supabaseAdmin.storage
            .from('explore-sections')
            .createSignedUrl(filePath, 31536000);

        if (signError) throw signError;

        return {
            success: true,
            path: filePath,
            url: signedUrlData?.signedUrl || '',
        };
    } catch (error) {
        console.error('Error uploading explore image:', error);
        throw error;
    }
}

// Server-side image delete function for explore sections using admin client (bypasses RLS)
export async function deleteExploreImageAction(imagePath: string) {
    try {
        if (!imagePath) return { success: true };

        const { error } = await supabaseAdmin.storage
            .from('explore-sections')
            .remove([imagePath]);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting explore image:', error);
        throw error;
    }
}


export async function createProductAction(productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    discount: number;
    rating: number;
    reviews: number;
    in_stock: boolean;
    is_flash_deal: boolean;
    image_url: string;
    image_path: string;
}) {
    try {
        const { error, data } = await supabaseAdmin
            .from('products')
            .insert([productData])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function updateProductAction(
    productId: string,
    productData: {
        name: string;
        description: string;
        price: number;
        category: string;
        discount: number;
        rating: number;
        reviews: number;
        in_stock: boolean;
        is_flash_deal: boolean;
        image_url: string;
        image_path: string;
    }
) {
    try {
        const { error, data } = await supabaseAdmin
            .from('products')
            .update({
                ...productData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', productId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export async function deleteProductAction(productId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', productId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function createFlashDealAction(dealData: {
    product_id: string;
    discount_percentage: number;
    start_date: string;
    end_date: string;
}) {
    try {
        const { error, data } = await supabaseAdmin
            .from('flash_deals')
            .insert([dealData])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating flash deal:', error);
        throw error;
    }
}

export async function updateFlashDealAction(
    dealId: string,
    dealData: {
        product_id: string;
        discount_percentage: number;
        start_date: string;
        end_date: string;
    }
) {
    try {
        const { error, data } = await supabaseAdmin
            .from('flash_deals')
            .update({
                ...dealData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', dealId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating flash deal:', error);
        throw error;
    }
}

export async function deleteFlashDealAction(dealId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('flash_deals')
            .delete()
            .eq('id', dealId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting flash deal:', error);
        throw error;
    }
}

export async function createExploreSectionAction(sectionData: {
    title: string;
    image_url: string;
    image_path: string;
    is_large: boolean;
    sort_order: number;
}) {
    try {
        const { error, data } = await supabaseAdmin
            .from('explore_sections')
            .insert([sectionData])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating explore section:', error);
        throw error;
    }
}

export async function updateExploreSectionAction(
    sectionId: string,
    sectionData: {
        title: string;
        image_url: string;
        image_path: string;
        is_large: boolean;
        sort_order: number;
    }
) {
    try {
        const { error, data } = await supabaseAdmin
            .from('explore_sections')
            .update({
                ...sectionData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', sectionId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating explore section:', error);
        throw error;
    }
}

export async function deleteExploreSectionAction(sectionId: string) {
    try {
        const { error } = await supabaseAdmin
            .from('explore_sections')
            .delete()
            .eq('id', sectionId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting explore section:', error);
        throw error;
    }
}
