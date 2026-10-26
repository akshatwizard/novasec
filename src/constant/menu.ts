export type MenuType = {
    name: string;
    path: string;
    icon: string
};

type SubMenu = Omit<MenuType, "subMenu">;

export const MenuItems: MenuType[] = [
    // {
    //     name: "Home",
    //     path: "/",
    // },
    {
        name: "Recycled Bags",
        path: "/recycled-bags",
        icon: "/images/recycled/recycled.jpeg"
    },
    {
        name: "Technical Textiles",
        path: "/technical-textiles",
        icon: "/images/textiles/tarpaulin.jpg"
    },
    {
        name: "Custom-made Bulk Bags",
        path: "/custom-made-bags",
        icon: "/images/custom-bag/bag.jpg"
    },
    {
        name: "About Us",
        path: "/about",
        icon: "/images/hero/company.jpeg"
    },
];
// Main-menu grouping: Recycled Bags joins the four product categories (from the menu API) as a
// highlighted primary link; the other static pages sit in the always-visible secondary row.
export const PRIMARY_STATIC_PATHS = ["/recycled-bags"];
export const PrimaryStaticItems = MenuItems.filter((m) => PRIMARY_STATIC_PATHS.includes(m.path));
export const SecondaryMenuItems = MenuItems.filter((m) => !PRIMARY_STATIC_PATHS.includes(m.path));
