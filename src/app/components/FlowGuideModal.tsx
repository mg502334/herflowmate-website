import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { X, Droplet, Droplets, Info, Sparkles, BookOpen } from "lucide-react";

interface FlowGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FlowGuideModal({ open, onOpenChange }: FlowGuideModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[#2C3E50]/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] bg-white rounded-[32px] overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-[#F8C8D1]/20 px-8 py-6 border-b border-[#F8C8D1]/30 flex items-start justify-between relative">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#957DAD] uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={12} /> Resource
              </span>
              <Dialog.Title style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-[#2C3E50]">
                Product & Flow Guide
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 font-medium">
                Find the perfect product and absorbency for your unique cycle.
              </Dialog.Description>
            </div>
            <Dialog.Close className="absolute right-6 top-6 rounded-full p-2 bg-white text-gray-400 hover:text-[#2C3E50] hover:bg-gray-100 transition-all shadow-sm">
              <X size={18} />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          <Tabs.Root defaultValue="absorbency" className="flex flex-col">
            <Tabs.List className="flex w-full border-b border-gray-100 bg-[#FAFAFA]">
              <Tabs.Trigger 
                value="absorbency"
                className="flex-1 py-4 text-sm font-bold text-gray-500 data-[state=active]:text-[#2C3E50] data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#957DAD] transition-all outline-none"
              >
                Absorbency Levels
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="products"
                className="flex-1 py-4 text-sm font-bold text-gray-500 data-[state=active]:text-[#2C3E50] data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#957DAD] transition-all outline-none"
              >
                Product Types
              </Tabs.Trigger>
            </Tabs.List>

            <div className="p-8 max-h-[60vh] overflow-y-auto">
              
              {/* Absorbency Tab */}
              <Tabs.Content value="absorbency" className="flex flex-col gap-6 outline-none animate-in fade-in duration-300">
                <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#F8C8D1] transition-colors">
                  <div className="flex gap-0.5 mt-1">
                    <Droplet size={18} fill="#F8C8D1" stroke="none" />
                    <Droplet size={18} className="text-gray-200" strokeWidth={1.5} />
                    <Droplet size={18} className="text-gray-200" strokeWidth={1.5} />
                    <Droplet size={18} className="text-gray-200" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Light Flow (1 Drop)</h4>
                    <p className="text-sm text-gray-600 mt-1">Best for spotting, the very beginning, or the tail-end of your period. Typically holds around 3-6g of fluid. Often found in liners and light tampons.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#E0BBE4] transition-colors">
                  <div className="flex gap-0.5 mt-1">
                    <Droplet size={18} fill="#E0BBE4" stroke="none" />
                    <Droplet size={18} fill="#E0BBE4" stroke="none" />
                    <Droplet size={18} className="text-gray-200" strokeWidth={1.5} />
                    <Droplet size={18} className="text-gray-200" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Regular Flow (2 Drops)</h4>
                    <p className="text-sm text-gray-600 mt-1">The standard for average flow days. Typically holds 6-9g of fluid. If you find yourself changing a regular pad/tampon every 4-6 hours, this is your baseline.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#957DAD] transition-colors">
                  <div className="flex gap-0.5 mt-1">
                    <Droplet size={18} fill="#957DAD" stroke="none" />
                    <Droplet size={18} fill="#957DAD" stroke="none" />
                    <Droplet size={18} fill="#957DAD" stroke="none" />
                    <Droplet size={18} className="text-gray-200" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Super / Heavy Flow (3 Drops)</h4>
                    <p className="text-sm text-gray-600 mt-1">Designed for heavy flow days (often days 1-2). Holds 9-12g of fluid. Use these when regular products fill up in less than 3 hours.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#2C3E50] transition-colors">
                  <div className="flex gap-0.5 mt-1">
                    <Droplet size={18} fill="#2C3E50" stroke="none" />
                    <Droplet size={18} fill="#2C3E50" stroke="none" />
                    <Droplet size={18} fill="#2C3E50" stroke="none" />
                    <Droplet size={18} fill="#2C3E50" stroke="none" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Overnight / Maximum (4+ Drops)</h4>
                    <p className="text-sm text-gray-600 mt-1">Maximum protection. These hold 12-18g+ of fluid. Pads in this category are longer and wider at the back to prevent leaks while lying down. Also excellent for postpartum care.</p>
                  </div>
                </div>
              </Tabs.Content>

              {/* Product Types Tab */}
              <Tabs.Content value="products" className="flex flex-col gap-6 outline-none animate-in fade-in duration-300">
                <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl bg-[#F8C8D1]/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">🌸</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Pads & Liners</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-2">External protection worn in your underwear. Great for sensitive skin or those who prefer non-insertable options. Liners are thin for spotting; pads range from light to overnight.</p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#957DAD] bg-[#F0E6FA] px-2 py-0.5 rounded">Change every 4-6 hours</span>
                  </div>
                </div>

                <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl bg-[#E0BBE4]/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">💧</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Tampons</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-2">Internal protection made of absorbent material. Ideal for swimming, sports, and active days. They sit inside the vaginal canal so you can't feel them when inserted correctly.</p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#957DAD] bg-[#F0E6FA] px-2 py-0.5 rounded">Change every 4-8 hours</span>
                  </div>
                </div>

                <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF9C4]/40 flex items-center justify-center shrink-0">
                    <span className="text-xl">🌙</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Overnight / Postpartum Pads</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-2">Extra-long and ultra-absorbent pads with a flared back design. Specifically made to prevent leaks when lying down asleep, or to handle heavy postpartum flow safely.</p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#957DAD] bg-[#F0E6FA] px-2 py-0.5 rounded">Change every 6-8 hours</span>
                  </div>
                </div>

                <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl bg-[#4DB6AC]/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">🍷</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Menstrual Cups</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-2">A reusable, flexible silicone cup worn internally to collect (rather than absorb) fluid. They are eco-friendly, cost-effective, and can safely last for years (up to 10 years with proper care!).</p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#957DAD] bg-[#F0E6FA] px-2 py-0.5 rounded">Empty every 10-12 hours</span>
                  </div>
                </div>

                <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-xl bg-[#FF8A65]/20 flex items-center justify-center shrink-0">
                    <span className="text-xl">⭕</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2C3E50] text-lg">Menstrual Discs / Rings</h4>
                    <p className="text-sm text-gray-600 mt-1 mb-2">An insertable ring that sits higher up in the vaginal fornix (tucked behind the pubic bone). It collects fluid, offers 12-hour protection, and leaves the vaginal canal clear for mess-free intimacy.</p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#957DAD] bg-[#F0E6FA] px-2 py-0.5 rounded">Empty every 10-12 hours</span>
                  </div>
                </div>
              </Tabs.Content>

            </div>
          </Tabs.Root>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
