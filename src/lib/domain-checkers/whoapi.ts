/**
 * WhoAPI Domain Availability Checker
 *
 * WhoAPI offers 10,000 free requests (one-time).
 * Sign up at: https://whoapi.com/
 *
 * Documentation: https://whoapi.com/domain-availability-api/
 */

interface WhoAPIResponse {
  status: string; // "0" = available, "1" = taken
  domain_name: string;
  response_time?: string;
  error?: string;
}

/**
 * Check if a single domain is available using WhoAPI
 */
export async function checkDomainWithWhoAPI(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.WHOAPI_KEY;

  if (!apiKey) {
    console.warn('WHOAPI_KEY not configured, using simulation');
    // Fallback to simulation if no API key
    return Math.random() > 0.5;
  }

  try {
    const response = await fetch(
      `https://api.whoapi.com/?domain=${encodeURIComponent(domain)}&r=taken&apikey=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`WhoAPI error: ${response.status} ${response.statusText}`);
    }

    const data: WhoAPIResponse = await response.json();

    if (data.error) {
      throw new Error(`WhoAPI returned error: ${data.error}`);
    }

    // "0" = available, "1" = taken
    return data.status === "0";
  } catch (error) {
    console.error(`WhoAPI error for ${domain}:`, error);
    throw error;
  }
}

/**
 * Check multiple domains (different TLDs) for availability
 */
export async function checkMultipleDomainsWhoAPI(
  name: string,
  tlds: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  const apiKey = process.env.WHOAPI_KEY;

  if (!apiKey) {
    console.warn('WHOAPI_KEY not configured, using simulation');
    // Return simulated results
    tlds.forEach(tld => {
      results.set(tld, Math.random() > 0.5);
    });
    return results;
  }

  // Check domains sequentially to respect rate limits
  for (const tld of tlds) {
    const domain = `${name}.${tld}`;

    try {
      const isAvailable = await checkDomainWithWhoAPI(domain);
      results.set(tld, isAvailable);

      // Add small delay to avoid rate limiting (100ms between requests)
      if (tlds.indexOf(tld) < tlds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error checking ${domain}:`, error);
      // On error, mark as unavailable to be safe
      results.set(tld, false);
    }
  }

  return results;
}

/**
 * Get the registrar for a domain (if WhoAPI key is available)
 */
export async function getDomainRegistrar(
  domain: string
): Promise<string | undefined> {
  const apiKey = process.env.WHOAPI_KEY;

  if (!apiKey) {
    return undefined;
  }

  try {
    const response = await fetch(
      `https://api.whoapi.com/?domain=${encodeURIComponent(domain)}&r=whois&apikey=${apiKey}`
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data.registrar_name;
  } catch (error) {
    console.error(`Error getting registrar for ${domain}:`, error);
    return undefined;
  }
}
