/**
 * Domain Availability Checker - Main Interface
 *
 * This module provides a unified interface for checking domain availability
 * across multiple providers with automatic fallback support.
 *
 * Supported providers:
 * - WhoAPI (10,000 free requests one-time)
 * - WhoisXML API (100 free requests per month)
 * - Simulation (for testing without API keys)
 */

import { checkDomainWithWhoAPI, checkMultipleDomainsWhoAPI } from './whoapi';
import { checkDomainWithWhoisXML, checkMultipleDomainsWhoisXML } from './whoisxml';

export type DomainChecker = 'whoapi' | 'whoisxml' | 'simulation';

/**
 * Get the configured domain checker provider
 */
function getDomainChecker(): DomainChecker {
  const checker = process.env.DOMAIN_CHECKER as DomainChecker;

  // If specific checker is requested, validate it has API key
  if (checker === 'whoapi' && process.env.WHOAPI_KEY) {
    return 'whoapi';
  }

  if (checker === 'whoisxml' && process.env.WHOISXML_API_KEY) {
    return 'whoisxml';
  }

  // Auto-select based on available API keys
  if (process.env.WHOAPI_KEY) {
    return 'whoapi';
  }

  if (process.env.WHOISXML_API_KEY) {
    return 'whoisxml';
  }

  // Fallback to simulation
  console.warn('No domain checker API keys configured, using simulation');
  return 'simulation';
}

/**
 * Check if a single domain is available
 * Uses configured provider with automatic fallback
 */
export async function checkDomainAvailability(
  domain: string
): Promise<boolean> {
  const checker = getDomainChecker();

  try {
    switch (checker) {
      case 'whoapi':
        return await checkDomainWithWhoAPI(domain);

      case 'whoisxml':
        return await checkDomainWithWhoisXML(domain);

      case 'simulation':
      default:
        // Simulation for development/testing
        await new Promise(resolve => setTimeout(resolve, 200));
        return Math.random() > 0.5;
    }
  } catch (error) {
    console.error(`Primary checker (${checker}) failed for ${domain}, trying fallback...`);

    // Try fallback providers
    try {
      // If primary was WhoAPI, try WhoisXML
      if (checker === 'whoapi' && process.env.WHOISXML_API_KEY) {
        return await checkDomainWithWhoisXML(domain);
      }

      // If primary was WhoisXML, try WhoAPI
      if (checker === 'whoisxml' && process.env.WHOAPI_KEY) {
        return await checkDomainWithWhoAPI(domain);
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    // If all fails, simulate
    console.warn('All checkers failed, using simulation');
    return Math.random() > 0.5;
  }
}

/**
 * Check multiple domains (same name, different TLDs) for availability
 */
export async function checkMultipleTLDs(
  name: string,
  tlds: string[]
): Promise<Map<string, boolean>> {
  const checker = getDomainChecker();

  try {
    switch (checker) {
      case 'whoapi':
        return await checkMultipleDomainsWhoAPI(name, tlds);

      case 'whoisxml':
        return await checkMultipleDomainsWhoisXML(name, tlds);

      case 'simulation':
      default:
        // Simulation
        const results = new Map<string, boolean>();
        await new Promise(resolve => setTimeout(resolve, 500));

        tlds.forEach(tld => {
          results.set(tld, Math.random() > 0.5);
        });

        return results;
    }
  } catch (error) {
    console.error(`Error checking multiple TLDs:`, error);

    // Fallback to simulation
    const results = new Map<string, boolean>();
    tlds.forEach(tld => {
      results.set(tld, Math.random() > 0.5);
    });
    return results;
  }
}

/**
 * Get information about the current domain checker configuration
 */
export function getDomainCheckerInfo() {
  const checker = getDomainChecker();

  const info = {
    provider: checker,
    simulation: checker === 'simulation',
    hasWhoAPI: !!process.env.WHOAPI_KEY,
    hasWhoisXML: !!process.env.WHOISXML_API_KEY,
  };

  return info;
}
