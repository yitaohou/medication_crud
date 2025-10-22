export type DrugSuggestion = {
    brand_name: string;
    generic_name: string;
    product_ndc: string;
};

export async function searchDrugs(query: string): Promise<DrugSuggestion[]> {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        // OpenFDA API - search by brand name
        const response = await fetch(
            `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(query)}*&limit=10`
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        
        if (!data.results) {
            return [];
        }

        const suggestions: DrugSuggestion[] = data.results
            .map((result: any) => ({
                brand_name: result.openfda?.brand_name?.[0] || '',
                generic_name: result.openfda?.generic_name?.[0] || '',
                product_ndc: result.openfda?.product_ndc?.[0] || '',
            }))
            .filter((drug: DrugSuggestion) => drug.brand_name)
            .filter((drug: DrugSuggestion, index: number, self: DrugSuggestion[]) => 
                index === self.findIndex(d => d.brand_name === drug.brand_name)
            )

        return suggestions;
    } catch (error) {
        console.error('Error fetching drug suggestions:', error);
        return [];
    }
}

export type DrugDetail = {
    ndc: string;
    dosage_and_administration?: string[];
    do_not_use?: string[];
    route?: string[];
};

export async function getDrugByNDC(ndc: string): Promise<DrugDetail | null> {
    try {
        const response = await fetch(
            `https://api.fda.gov/drug/label.json?search=openfda.product_ndc:"${ndc}"&limit=1`
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return null;
        }

        const result = data.results[0];
        return {
            ndc: result.openfda?.product_ndc?.[0] || '',
            dosage_and_administration: result.dosage_and_administration || [],
            do_not_use: result.do_not_use || [],
            route: result.openfda?.route || [],
        };
    } catch (error) {
        console.error('Error fetching drug by NDC:', error);
        return null;
    }
}