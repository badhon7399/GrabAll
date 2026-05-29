import { useLanguage } from '../context/LanguageContext';

interface RefundPolicyViewProps {
  resetAllFilters: () => void;
}

export default function RefundPolicyView({ resetAllFilters }: RefundPolicyViewProps) {
  const { language } = useLanguage();
  const isEN = language === 'en';

  return (
    <section className="py-8 max-w-4xl mx-auto animate-in fade-in duration-300 text-xs">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-deep-navy">
          {isEN ? 'Return & Refund Policy' : 'ফেরত ও রিফান্ড নীতি'}
        </h2>
        <button 
          onClick={resetAllFilters}
          className="px-4 py-2 border rounded-xl hover:bg-surface-container-low font-semibold transition-all text-xs"
        >
          {isEN ? 'Back to Home' : 'হোমে ফিরে যান'}
        </button>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-6 md:p-8 space-y-6 text-on-surface leading-relaxed text-sm">
        <p className="text-xs text-on-surface-variant font-mono">
          {isEN ? 'Last Updated: May 29, 2026' : 'সর্বশেষ আপডেট: ২৯ মে, ২০২৬'}
        </p>

        {isEN ? (
          <>
            <p>
              Thank you for shopping at GrabAll Goods. We want you to be entirely satisfied with your purchase. If you are not happy with your order, we are here to help.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">1. Returns and Replacements</h3>
            <p>
              Under Bangladesh e-commerce regulations, you have <strong>7 calendar days</strong> to request a return or replacement from the date you received the item.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.</li>
              <li>Your item must have the original receipt, invoice, or proof of purchase.</li>
              <li>Products such as dynamic digital items, custom modifications, or personal hygiene gear are not eligible for returns unless they arrive damaged.</li>
            </ul>

            <h3 className="text-lg font-bold text-deep-navy pt-2">2. Refund Processing</h3>
            <p>
              Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.
            </p>
            <p>
              If your return is approved, we will initiate a refund to your original payment method (e.g., bKash). The refund will be processed and credited within <strong>7 to 10 working days</strong>, depending on payment gateway settlement times.
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">3. Shipping Costs</h3>
            <p>
              You will be responsible for paying your own shipping costs for returning your item. Return shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund unless the return is due to our error (defective/damaged product).
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">4. Support</h3>
            <p>
              If you have any questions on how to return your item to us, please contact us at <a href="mailto:refunds@graballgoods.com" className="text-[#0088FF] hover:underline">refunds@graballgoods.com</a>.
            </p>
          </>
        ) : (
          <>
            <p>
              গ্র্যাবঅল গুডস-এ কেনাকাটা করার জন্য ধন্যবাদ। আমরা চাই আপনি আপনার কেনাকাটায় সম্পূর্ণ সন্তুষ্ট থাকুন। যদি কোনো কারণে আপনি সন্তুষ্ট না হন, আমরা আপনাকে সাহায্য করতে প্রস্তুত।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">১. ফেরত ও পরিবর্তন (Returns & Replacements)</h3>
            <p>
              বাংলাদেশের ই-কমার্স নীতিমালা অনুযায়ী, পণ্য পাওয়ার পর থেকে সর্বোচ্চ <strong>৭ দিন</strong> এর মধ্যে ফেরত বা পরিবর্তন করার জন্য আবেদন করা যাবে।
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>ফেরত দেওয়ার জন্য পণ্যটি অব্যবহৃত এবং আপনি যেভাবে পেয়েছিলেন সেই একই অবস্থায় থাকতে হবে। এটি মূল প্যাকেজিং-এ থাকতে হবে।</li>
              <li>পণ্যটির সাথে মূল রসিদ, ইনভয়েস বা ক্রয়ের প্রমাণ থাকতে হবে।</li>
              <li>ডিজিটাল ফাইল বা কাস্টমাইজড সামগ্রী ত্রুটিপূর্ণ না হলে তা ফেরতের যোগ্য বলে গণ্য হবে না।</li>
            </ul>

            <h3 className="text-lg font-bold text-deep-navy pt-2">২. রিফান্ড প্রক্রিয়া (Refund Processing)</h3>
            <p>
              আমরা ফেরত পাঠানো পণ্য পাওয়ার পর তা পরীক্ষা করব এবং আপনাকে অবহিত করব। পণ্যটি যাচাই করার পর আমরা রিফান্ডের অনুমোদনের অবস্থা আপনাকে জানাব।
            </p>
            <p>
              আপনার ফেরত দেওয়ার অনুরোধ অনুমোদিত হলে, আমরা আপনার মূল পেমেন্ট পদ্ধতিতে (যেমন: বিকাশ) রিফান্ড পাঠিয়ে দেব। পেমেন্ট গেটওয়ের নিয়ম অনুযায়ী রিফান্ডের অর্থ আপনার অ্যাকাউন্টে পৌঁছাতে সাধারণত <strong>৭ থেকে ১০ কার্যদিবস</strong> সময় লাগতে পারে।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৩. শিপিং খরচ</h3>
            <p>
              পণ্য ফেরত পাঠানোর জন্য শিপিং খরচ গ্রাহককে বহন করতে হবে। শিপিং খরচ অফেরতযোগ্য। তবে পণ্যটি যদি প্রথম থেকেই ত্রুটিপূর্ণ বা ভুল হয়ে থাকে, সেক্ষেত্রে আমরা রিটার্ন শিপিং খরচ বহন করব।
            </p>

            <h3 className="text-lg font-bold text-deep-navy pt-2">৪. যোগাযোগ</h3>
            <p>
              পণ্য ফেরত পাঠানো বা রিফান্ড সম্পর্কিত যেকোনো তথ্যের জন্য যোগাযোগ করুন: <a href="mailto:refunds@graballgoods.com" className="text-[#0088FF] hover:underline">refunds@graballgoods.com</a>।
            </p>
          </>
        )}
      </div>
    </section>
  );
}
