@@ .. @@
 import React, { useState } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
 import { useQuery, useMutation } from '@tanstack/react-query';
-import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
+import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
 import { cartService } from '../../services/cart';
 import { useCart } from '../../hooks/useCart';
 import { useAuth } from '../../hooks/useAuth';