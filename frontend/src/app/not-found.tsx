import BtnRightArrow from "@/components/icons/BtnRightArrow";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function NotFoundPage() {
  return (
    <section className="flex items-center h-full p-16 dark:bg-gray-50 dark:text-gray-800">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2
            className="mb-8 font-extrabold text-h1 font-700 dark:text-gray-400"
            style={{ fontSize: 50 }}
          >
            404
          </h2>
          <p className="text-h2 font-500 md:text-3xl">
            Sorry, we couldn&apos;t find this page.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-600">
            But don&apos;t worry, you can find plenty of other things on our homepage.
          </p>
          <Link href={"/"}>
            <Button
              variant={"action_green"}
              className="btn_action_green_rounded"
            >
              <BtnRightArrow />
              <span>CONTINUE SHOPPING</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
