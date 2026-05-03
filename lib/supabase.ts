import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server client for admin operations (service role key - bypasses RLS)
// Only create if service key is available (server-side only)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : createClient(supabaseUrl, supabaseAnonKey); // Fallback to anon key

// Helper function to upload product image
export async function uploadProductImage(file: File, productId: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Helper function to delete product image
export async function deleteProductImage(imagePath: string) {
  try {
    const { error } = await supabase.storage
      .from('products')
      .remove([imagePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Helper function to upload explore section image
export async function uploadExploreImage(file: File, sectionId: string) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${sectionId}-${Date.now()}.${fileExt}`;
    const filePath = `explore-sections/${fileName}`;

    const { error } = await supabase.storage
      .from('explore-sections')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('explore-sections')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: urlData.publicUrl,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Helper function to delete explore section image
export async function deleteExploreImage(imagePath: string) {
  try {
    const { error } = await supabase.storage
      .from('explore-sections')
      .remove([imagePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}
