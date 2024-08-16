import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
    categoryId,
    limit,
    searchParams,
}: {
    categoryId: string;
    limit?: number;
    searchParams?: any;
}) => {
    const wixClient = await wixClientServer();
    let productQuery = wixClient.products
        .queryProducts()
        .startsWith("name", searchParams?.name || "")
        .eq("collectionIds", categoryId)
        .hasSome("productType", searchParams?.type ? [searchParams.type] : ["physical", "digital"])
        .gt("priceData.price", searchParams?.min || 0)
        .lt("priceData.price", searchParams?.max || 999999)
        .limit(limit || PRODUCT_PER_PAGE)
        .skip(searchParams?.page ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE) : 0);

    if (searchParams?.sort) {
        let [sortType, sortBy] = searchParams.sort.split(" ");

        if (sortType === "asc") {
            productQuery = productQuery.ascending(sortBy);
        }
        if (sortType === "desc") {
            productQuery = productQuery.descending(sortBy);
        }
    }

    const res = await productQuery.find();

    return (
        <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
            {res.items.map((item: products.Product) => {
                return (
                    <Link
                        key={item._id}
                        href={`/${item.slug}`}
                        className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
                    >
                        <div className="relative w-full h-80">
                            <Image
                                src={item.media?.mainMedia?.image?.url || "/product.png"}
                                alt=""
                                fill
                                sizes="25vw"
                                className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
                            />
                            {item.media?.items && (
                                <Image
                                    src={item.media?.items[1]?.image?.url || "/product.png"}
                                    alt=""
                                    fill
                                    sizes="25vw"
                                    className="absolute object-cover rounded-md"
                                />
                            )}
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">{item.name}</span>
                            <span className="font-semibold">
                                {item.priceData?.formatted?.price}
                            </span>
                        </div>
                        {item.additionalInfoSections && (
                            <div
                                className="text-sm text-gray-500"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(
                                        item.additionalInfoSections?.find((section: any) => {
                                            return section.title === "shortDesc";
                                        })?.description || ""
                                    ),
                                }}
                            ></div>
                        )}
                        <button className="rounded-2xl ring-1 w-max ring-notification text-notification py-2 px-4 text-xs hover:bg-notification hover:text-white">
                            Add to Cart
                        </button>
                    </Link>
                );
            })}
            {searchParams?.cat || searchParams?.name ? (
                <Pagination
                    currentPage={res.currentPage || 0}
                    hasPrev={res.hasPrev()}
                    hasNext={res.hasNext()}
                />
            ) : null}
        </div>
    );
};
export default ProductList;
