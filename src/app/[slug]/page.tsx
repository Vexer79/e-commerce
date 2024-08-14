import { wixClientServer } from "@/lib/wixClientServer";
import Add from "../../components/Add";
import CustomizeProducts from "../../components/CustomizeProducts";
import ProductImages from "../../components/ProductImages";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

const SinglePage = async ({ params }: { params: { slug: string } }) => {
    const wixClient = await wixClientServer();
    console.log(params.slug);

    const products = await wixClient.products.queryProducts().eq("slug", params.slug).find();
    if (!products.items[0]) {
        return notFound();
    }
    const product = products.items[0];
    return (
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
            {/* IMG */}
            <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
                <ProductImages items={product.media?.items} />
            </div>
            {/* TEXTS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-4xl font-medium">{product.name}</h1>
                <p
                    className="text-gray-500"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.description || ""),
                    }}
                ></p>
                <div className="h-[2px] bg-gray-100" />
                {product.priceData?.discountedPrice === product.priceData?.price ? (
                    <h3 className="text-xl text-gray-500 line-through">
                        {product.priceData?.price}
                        {product.priceData?.currency}
                    </h3>
                ) : (
                    <div className="flex items-center gap-4">
                        <h3 className="text-xl text-gray-500 line-through">
                            {product.priceData?.price}
                            {product.priceData?.currency}
                        </h3>
                        <h2 className="font-medium text-2xl">
                            {product.priceData?.discountedPrice}
                            {product.priceData?.currency}
                        </h2>
                    </div>
                )}
                <div className="h-[2px] bg-gray-100" />
                <CustomizeProducts />
                <Add />
                <div className="h-[2px] bg-gray-100" />
                {product.additionalInfoSections?.map((section: any) => (
                    <div className="text-sm" key={section.title}>
                        <h4 className="font-medium mb-4">{section.title}</h4>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(section.description || ""),
                            }}
                        ></p>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SinglePage;
