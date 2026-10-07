import PageLayout from "../components/layout/PageLayout.jsx";
import QuickBookFlow from "../components/quickBook/QuickBookFlow.jsx";

// Quickly Book Your Luxury Ride (Figma, 1440 frame): the header, then one
// form card 1346 wide (47px each side) - see QuickBookFlow.
// Two teal glows (Figma: 100 x 100, #24B9A5, blur 242 = CSS blur 121px): one
// at the top right (top 6, left 1340 - up in the header band), pinned to the
// top of the page (the wrapper starts under the 107px header, hence -101);
// and one at the bottom left, centred on the left edge so it bleeds in from
// it, pinned to the bottom of the form so it stays at the card's corner
// whatever the form's height: its bottom edge 89px above the wrapper's end
// (the card's 120px bottom margin + 109px up the card - the spot it had on
// the 782px Point-To-Point card).
export default function QuickBookPage() {
  return (
    <PageLayout>
      <div className="relative flow-root">
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute -top-[101px] left-[1340px] z-[60] w-[100px] h-[100px] rounded-full bg-[#24B9A5] blur-[121px]"
        />
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute bottom-[89px] -left-[50px] w-[100px] h-[100px] rounded-full bg-[#24B9A5] blur-[121px]"
        />
        <QuickBookFlow />
      </div>
    </PageLayout>
  );
}
