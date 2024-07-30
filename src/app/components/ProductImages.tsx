"use client";
import Image from "next/image";
import { useState } from "react";

const images = [
    {
        id: 0,
        imgUrl: "https://images.pexels.com/photos/27215761/pexels-photo-27215761.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load",
    },
    {
        id: 1,
        imgUrl: "https://images.pexels.com/photos/13760155/pexels-photo-13760155.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
    {
        id: 2,
        imgUrl: "https://images.pexels.com/photos/14452691/pexels-photo-14452691.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
    {
        id: 3,
        imgUrl: "https://images.pexels.com/photos/8155559/pexels-photo-8155559.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    },
];

const ProductImages = () => {
    const [index, setIndex] = useState(0);
    return (
        <div className="">
            <div className="h-[500px] relative">
                <Image
                    src={images[index].imgUrl}
                    alt=""
                    fill
                    sizes="50vw"
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex justify-evenly gap-4 mt-8">
                {images.map((image, index) => (
                    <div
                        className="w-1/4 h-32 relative gap-4 mt-8 cursor-pointer"
                        key={image.id}
                        onClick={() => setIndex(index)}
                    >
                        <Image
                            src={image.imgUrl}
                            alt=""
                            fill
                            sizes="30vw"
                            className="object-cover rounded-md"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ProductImages;
