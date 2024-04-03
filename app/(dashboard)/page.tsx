'use client';

import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";
import { useSearchParams } from "next/navigation";

// interface DashboardProps {
//     searchParams: {
//         search?: string;
//         favourites?: string;
//     }
// };

const DashboardPage = () => {
    const { organization } = useOrganization();

    const params  = useSearchParams();

    let searchParams = {
        search: params.get('search') || undefined,
        favourites: params.get("favourites") || undefined
    } as { search?: string; favourites?: string};

    return (
        <div className="flex-1 h-[calc(100%-80px)] p-6">
            { !organization ? (<EmptyOrg/>)  : (<BoardList orgId={organization.id} query={searchParams}/>) }
        </div>
    );
}

export default DashboardPage;
