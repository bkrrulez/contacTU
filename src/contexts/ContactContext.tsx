

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Contact } from '@/lib/types';
import { getContactsForPage } from '@/app/dashboard/contacts/actions';
import { useToast } from '@/hooks/use-toast';

interface ContactContextType {
  contacts: Contact[];
  isLoading: boolean;
  removeContact: (contactId: number) => void;
  refreshContacts: () => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const contactsData = await getContactsForPage();
      setContacts(contactsData);
    } catch (error) {
      console.error("Failed to load contacts", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load contacts.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const removeContact = (contactId: number) => {
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
  };
  
  const refreshContacts = useCallback(async () => {
      await fetchContacts();
  }, [fetchContacts])

  return (
    <ContactContext.Provider value={{ contacts, isLoading, removeContact, refreshContacts }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}
