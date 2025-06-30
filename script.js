const SUPABASE_URL = 'https://ekzpwrmmbcqgsxqhtzwu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenB3cm1tYmNxZ3N4cWh0end1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMjcwNzAsImV4cCI6MjA2NjgwMzA3MH0.Ty9g17yf8k_3wv-I8LEhSHLwe0W3kAWc_hJks-ZiEV0';

const { createClient } = supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  const machine = form.machine.value.trim();
  const description = form.description.value.trim();
  const powerOff = form.powerOff.value;
  const date = form.date.value;
  const reporter = form.reporter.value.trim();
  const imageFile = document.getElementById('image').files[0];

  let imageUrl = null;

  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `reports/${Date.now()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('report-images')
      .upload(filePath, imageFile);

    if (storageError) {
      alert('Image upload failed.');
      return;
    }

    const { data: publicURL } = supabase
      .storage
      .from('report-images')
      .getPublicUrl(filePath);

    imageUrl = publicURL.publicUrl;
  }

  const { error } = await supabase.from('reports').insert([
    {
      machine,
      description,
      power_off_time: powerOff,
      date,
      reporter,
      image_url: imageUrl,
    }
  ]);

  if (error) {
    alert('Error submitting report');
    return;
  }

  form.reset();
  document.getElementById('successMessage').classList.remove('hidden');
});
