```
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

kubectl create namespace istio-system

helm install istio-base istio/base --namespace istio-system

helm install istiod istio/istiod --namespace istio-system

helm install istio-ingressgateway istio/gateway --namespace istio-system

kubectl get pods -n istio-system

kubectl label namespace default istio-injection=enabled

kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/bookinfo/platform/kube/bookinfo.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/bookinfo/networking/bookinfo-gateway.yaml

kubectl get services -n istio-system

kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.23/samples/addons/kiali.yaml

kubectl port-forward svc/kiali -n istio-system 20001:20001

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.23/samples/addons/prometheus.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.23/samples/addons/grafana.yaml


```