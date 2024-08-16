import { wixClientServer } from "@/lib/wixClientServer";
import Add from "../../components/Add";
import CustomizeProducts from "../../components/CustomizeProducts";
import ProductImages from "../../components/ProductImages";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

const SinglePage = async ({ params }: { params: { slug: string } }) => {
    const wixClient = await wixClientServer();

    const products = await wixClient.products.queryProducts().eq("slug", params.slug).find();
    if (!products.items[0]) {
        return notFound();
    }
    const product = products.items[0];

    const reviewRes = await fetch(
        `https://api.fera.ai/v3/public/reviews?product.id=${product._id}&public_key=${process.env.NEXT_PUBLIC_FERA_ID}`
    );
    const reviews = await reviewRes.json();

    return (
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative flex flex-col lg:flex-row gap-16">
            {/* IMG */}
            <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
                <ProductImages items={product.media?.items} />
            </div>
            {/* TEXTS */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <h1 className="text-4xl font-medium">{product.name}</h1>
                <div
                    className="text-gray-500"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.description || ""),
                    }}
                ></div>
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
                {product.variants && product._id && product.productOptions ? (
                    <CustomizeProducts
                        productId={product._id}
                        variants={product.variants}
                        productOptions={product.productOptions}
                    />
                ) : (
                    <Add
                        productId={product._id!}
                        variantId="00000000-000000-000000-000000000000"
                        stockNumber={product.stock?.quantity || 0}
                    />
                )}
                <div className="h-[2px] bg-gray-100" />
                {product.additionalInfoSections?.map((section: any) => (
                    <div className="text-sm" key={section.title}>
                        <h4 className="font-medium mb-4">{section.title}</h4>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(section.description || ""),
                            }}
                        ></div>
                    </div>
                ))}
                <h1>User Reviews</h1>
                {reviews.data.map((review: any) => {
                    <div className="flex flex-col gap-4 font-medium" key={review.id}>
                        {/* USER */}
                        <div className="flex items-center gap-4 font-medium">
                            <Image
                                src={review.customer.avatar_url}
                                alt=""
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <span>{review.customer.display_name}</span>
                        </div>
                        {/* STARS */}
                        <div className="flex gap-2">
                            {Array.from({ length: review.rating }).map((_, index) => (
                                <Image src="star.png" alt="" key={index} width={16} height={16} />
                            ))}
                        </div>
                        {/* DESC */}
                        {review.heading && <p>{review.heading}</p>}
                        {review.body && <p>{review.body}</p>}
                        <div className="">
                            {review.media.map((media: any) => (
                                <Image
                                    src={media.url}
                                    key={media.id}
                                    alt=""
                                    width={100}
                                    height={50}
                                    className="object-cover"
                                />
                            ))}
                        </div>
                    </div>;
                })}
            </div>
        </div>
    );
};
export default SinglePage;
