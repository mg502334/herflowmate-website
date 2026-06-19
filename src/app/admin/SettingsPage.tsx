import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useStoreSettings, ReportSettings } from "../data/useStoreSettings";
import { useProfiles } from "../data/useProfiles";
import { Upload, Image as ImageIcon, Save, CheckCircle2, Users, Link2, Printer, FileText } from "lucide-react";

export function SettingsPage() {
  const { settings, loading: settingsLoading, updateLogoUrl, updatePrinterFormat, updateReportSettings } = useStoreSettings();
  const { profiles, loading: profilesLoading, updateRole, error: profilesError } = useProfiles();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setSuccessMsg("");
      setErrorMsg("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        await updateLogoUrl(data.publicUrl);
        setSuccessMsg("Logo updated successfully!");
        setFile(null);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  if (settingsLoading || profilesLoading) {
    return <div className="p-10 text-center text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-gray-400 mt-2">Manage your admin portal and storefront configurations.</p>
      </div>

      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-[#38BDF8]" />
          Branding
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Business Logo</label>
            <p className="text-xs text-gray-500 mb-4">Upload a transparent PNG for best results. This logo will appear in the admin sidebar.</p>
            
            <div className="flex items-start gap-8">
              {/* Current/Preview Image */}
              <div className="w-32 h-32 bg-[#0F172A] border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden p-4">
                {(previewUrl || settings?.business_logo_url) ? (
                  <img 
                    src={previewUrl || settings?.business_logo_url || ""} 
                    alt="Logo Preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-600 text-sm">No Logo</span>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#0F172A] file:text-[#38BDF8] file:border file:border-gray-700
                    hover:file:bg-[#0F172A]/80 hover:file:cursor-pointer transition-colors"
                />
                
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    !file || isUploading 
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                      : 'bg-[#38BDF8] text-[#0F172A] hover:bg-[#38BDF8]/90 shadow-lg shadow-[#38BDF8]/20'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0F172A]/20 border-t-[#0F172A] rounded-full animate-spin mr-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Save New Logo
                    </>
                  )}
                </button>

                {successMsg && (
                  <p className="text-sm text-emerald-400 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> {successMsg}
                  </p>
                )}
                {errorMsg && (
                  <p className="text-sm text-red-400">
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Printer className="w-5 h-5 mr-2 text-[#38BDF8]" />
          Printer Settings
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Shipping Label Format</label>
            <p className="text-xs text-gray-500 mb-4">Select the format that best matches your printer. Changes are saved automatically and applied to all future labels.</p>
            
            <select
              value={settings?.printer_label_format || 'PDF'}
              onChange={(e) => updatePrinterFormat(e.target.value as any).catch(err => alert(err.message))}
              className="w-full max-w-sm bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
            >
              <option value="PDF">Standard PDF (8.5x11)</option>
              <option value="PDF_4x6">Thermal PDF (4x6)</option>
              <option value="ZPLII">Direct Thermal (ZPL II)</option>
              <option value="PNG">Image Format (PNG)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-[#38BDF8]" />
          Report Configuration
        </h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Business Name</label>
              <input
                type="text"
                value={settings?.report_settings?.businessName || ''}
                onChange={(e) => updateReportSettings({ ...settings?.report_settings, businessName: e.target.value })}
                className="w-full bg-[#0F172A] border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                placeholder="e.g. HerFlowMate Inc."
              />
            </div>
            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="pageNumbers"
                checked={settings?.report_settings?.pageNumbers !== false}
                onChange={(e) => updateReportSettings({ ...settings?.report_settings, pageNumbers: e.target.checked })}
                className="w-4 h-4 text-[#38BDF8] bg-[#0F172A] border-gray-700 rounded focus:ring-[#38BDF8]"
              />
              <label htmlFor="pageNumbers" className="ml-2 text-sm font-medium text-gray-400">Include Page Numbers</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Primary Color</label>
              <input
                type="color"
                value={settings?.report_settings?.primaryColor || '#38BDF8'}
                onChange={(e) => updateReportSettings({ ...settings?.report_settings, primaryColor: e.target.value })}
                className="w-full h-10 bg-[#0F172A] border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Secondary Color</label>
              <input
                type="color"
                value={settings?.report_settings?.secondaryColor || '#0F172A'}
                onChange={(e) => updateReportSettings({ ...settings?.report_settings, secondaryColor: e.target.value })}
                className="w-full h-10 bg-[#0F172A] border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Typography Settings */}
          <div className="border-t border-gray-800 pt-6">
            <h3 className="text-sm font-semibold text-white mb-4">Typography</h3>
            {['titles', 'paragraphs', 'subnotes'].map((type) => (
              <div key={type} className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{type} Font</label>
                  <select
                    value={(settings?.report_settings as any)?.[type]?.fontFamily || 'Inter'}
                    onChange={(e) => {
                      const current = (settings?.report_settings as any)?.[type] || {};
                      updateReportSettings({ ...settings?.report_settings, [type]: { ...current, fontFamily: e.target.value } });
                    }}
                    className="w-full bg-[#0F172A] border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Arial">Arial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Weight</label>
                  <select
                    value={(settings?.report_settings as any)?.[type]?.fontWeight || 'normal'}
                    onChange={(e) => {
                      const current = (settings?.report_settings as any)?.[type] || {};
                      updateReportSettings({ ...settings?.report_settings, [type]: { ...current, fontWeight: e.target.value } });
                    }}
                    className="w-full bg-[#0F172A] border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                  <input
                    type="color"
                    value={(settings?.report_settings as any)?.[type]?.color || (type === 'subnotes' ? '#9ca3af' : '#ffffff')}
                    onChange={(e) => {
                      const current = (settings?.report_settings as any)?.[type] || {};
                      updateReportSettings({ ...settings?.report_settings, [type]: { ...current, color: e.target.value } });
                    }}
                    className="w-full h-8 bg-[#0F172A] border border-gray-700 rounded cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#38BDF8]" />
            User Management
          </h2>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + '/admin/login');
              setCopySuccess(true);
              setTimeout(() => setCopySuccess(false), 2000);
            }}
            className="flex items-center px-4 py-2 bg-[#38BDF8]/10 text-[#38BDF8] rounded-lg font-medium hover:bg-[#38BDF8]/20 transition-colors text-sm"
          >
            {copySuccess ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
            {copySuccess ? 'Copied!' : 'Copy Invite Link'}
          </button>
        </div>
        
        {profilesError && (
          <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
            {profilesError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-sm text-gray-400">
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined</th>
                <th className="pb-3 font-medium text-right">Revoked On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {profiles.map(profile => (
                <tr key={profile.id} className="text-sm">
                  <td className="py-4 text-white font-medium">{profile.email}</td>
                  <td className="py-4">
                    <select
                      value={profile.role}
                      onChange={(e) => updateRole(profile.id, e.target.value as 'admin' | 'staff' | 'revoked').catch(err => alert(err.message))}
                      className={`bg-[#0F172A] border border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#38BDF8] ${
                        profile.role === 'admin' 
                          ? 'text-[#38BDF8] font-bold' 
                          : profile.role === 'revoked'
                            ? 'text-red-400 font-bold'
                            : 'text-gray-300'
                      }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="revoked" className="text-red-400">Revoked</option>
                    </select>
                  </td>
                  <td className="py-4 text-gray-400">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-gray-400 text-right">
                    {profile.revoked_at ? (
                      <span className="text-red-400">{new Date(profile.revoked_at).toLocaleDateString()}</span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
