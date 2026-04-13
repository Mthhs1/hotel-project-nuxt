type NavOption = {
    label: string
    icon?: string
    to?: string
    defaultOpen?: boolean
    children?: NavOption[]
    target?: string
}

export default function getDashboardNavOptions(role: string) {
    const basicOptions: NavOption[][] = [
        [
            {
                label: "Home",
                icon: "i-lucide-house",
                to: "/",
            },
            {
                label: "Reserva",
                defaultOpen: true,
                icon: "i-lucide-inbox",
                to: "/dashboard/reservation",
                children: [
                    {
                        label: "Ver minhas reservas",
                        to: "/dashboard/reservation/my",
                    },
                    {
                        label: "Fazer uma reserva",
                        to: "/dashboard/reservation/list",
                    },
                ],
            },
            {
                label: "Meus Dados",
                icon: "i-lucide-users",
            },
            {
                label: "Settings",
                icon: "i-lucide-settings",
                defaultOpen: false,
                children: [
                    {
                        label: "General",
                    },
                    {
                        label: "Members",
                    },
                    {
                        label: "Notifications",
                    },
                    {
                        label: "Notifications",
                    },
                ],
            },
        ],
        [
            {
                label: "Feedback",
                icon: "i-lucide-message-circle",
                to: "https://github.com/nuxt-ui-templates/dashboard",
                target: "_blank",
            },
            {
                label: "Help & Support",
                icon: "i-lucide-info",
                to: "https://github.com/nuxt/ui",
                target: "_blank",
            },
        ],
    ]

    const objEmployee: NavOption = {
        label: "Funcionários",
        icon: "tabler:user-check",
        to: "/dashboard/employee",
    }

    const objAdmin: NavOption = {
        label: "Admin",
        defaultOpen: true,
        icon: "i-lucide-shield",
        to: "/dashboard/admin",
    }

    if (role === "user") {
        return basicOptions
    } else if (role === "employee") {
        basicOptions[0]?.splice(2, 0, objEmployee)
        return basicOptions
    } else if (role === "admin") {
        basicOptions[0]?.splice(2, 0, objAdmin)
        return basicOptions
    }
}
