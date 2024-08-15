"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useState } from "react";

const Add = ({
    productId,
    variantId,
    stockNumber,
}: {
    productId: string;
    variantId: string;
    stockNumber: number;
}) => {
    const [quantity, setQuantity] = useState(1);

    const handleQuantity = {
        decrease: () => quantity > 1 && setQuantity((prev) => prev - 1),
        increase: () => quantity < stockNumber && setQuantity((prev) => prev + 1),
    };

    const wixClient = useWixClient();
    const { addItem, isLoading } = useCartStore();
    return (
        <div className="flex flex-col gap-4">
            <h4 className="font-medium">Choose a Quantity</h4>
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
                        <button
                            className="cursor-pointer text-xl select-none"
                            onClick={handleQuantity.decrease}
                        >
                            -
                        </button>
                        {quantity}
                        <button
                            className="cursor-pointer text-xl select-none"
                            onClick={handleQuantity.increase}
                        >
                            +
                        </button>
                    </div>
                    {stockNumber < 1 ? (
                        <div className="text-xs">Product is out of stock</div>
                    ) : (
                        <div className="text-xs">
                            Only <span className="text-orange-500">{stockNumber} items</span> left!
                            <br />
                            {"Don't"} miss it
                        </div>
                    )}
                </div>
                <button
                    onClick={() => addItem(wixClient, productId, variantId, quantity)}
                    disabled={isLoading}
                    className="w-36 text-sm rounded-3xl ring-1 ring-notification text-notification py-2 px-4 hover:bg-notification hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-white disabled:ring-none disabled:ring-0"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};
export default Add;
