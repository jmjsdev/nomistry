/**
 * WhoisXML API Domain Availability Checker
 *
 * WhoisXML API offers 100 free requests per month.
 * Sign up at: https://whoisxmlapi.com/
 *
 * Documentation: https://domain-availability.whoisxmlapi.com/
 */

interface WhoisXMLResponse {
  DomainInfo: {
    domainAvailability: 'AVAILABLE' | 'UNAVAILABLE';
    domainName: string;
  };
  ErrorMessage?: {
    msg: string;
  };
}

/**
 * Check if a single domain is available using WhoisXML API
 */
export async function checkDomainWithWhoisXML(
  domain: string
): Promise<boolean> {
  const apiKey = process.env.WHOISXML_API_KEY;

  if (!apiKey) {
    console.warn('WHOISXML_API_KEY not configured, using simulation');
    return Math.random() > 0.5;
  }

  try {
    const response = await fetch(
      `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${encodeURIComponent(domain)}&mode=DNS_AND_WHOIS`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`WhoisXML API error: ${response.status} ${response.statusText}`);
    }

    const data: WhoisXMLResponse = await response.json();

    if (data.ErrorMessage) {
      throw new Error(`WhoisXML API error: ${data.ErrorMessage.msg}`);
    }

    return data.DomainInfo.domainAvailability === 'AVAILABLE';
  } catch (error) {
    console.error(`WhoisXML API error for ${domain}:`, error);
    throw error;
  }
}

/**
 * Check multiple domains (different TLDs) for availability
 */
export async function checkMultipleDomainsWhoisXML(
  name: string,
  tlds: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  const apiKey = process.env.WHOISXML_API_KEY;

  if (!apiKey) {
    console.warn('WHOISXML_API_KEY not configured, using simulation');
    tlds.forEach(tld => {
      results.set(tld, Math.random() > 0.5);
    });
    return results;
  }

  // WhoisXML API supports parallel requests
  const promises = tlds.map(async (tld) => {
    const domain = `${name}.${tld}`;

    try {
      const isAvailable = await checkDomainWithWhoisXML(domain);
      return { tld, isAvailable };
    } catch (error) {
      console.error(`Error checking ${domain}:`, error);
      return { tld, isAvailable: false };
    }
  });

  const resolvedResults = await Promise.all(promises);

  resolvedResults.forEach(({ tld, isAvailable }) => {
    results.set(tld, isAvailable);
  });

  return results;
}
